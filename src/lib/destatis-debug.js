// Enhanced Destatis API Debug Tool
import config from './config';

export class DestAtisDebugger {
  constructor() {
    this.baseURL = 'https://www-genesis.destatis.de/genesisWS/rest/2020';
    this.credentials = {
      username: config.destatis.apiKey,
      password: '', // Destatis uses only API key as username
    };
    this.isAvailable = !!this.credentials.username;
    this.debugLog = [];
  }

  log(message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      data
    };
    this.debugLog.push(logEntry);
    console.log(`[Destatis Debug] ${message}`, data || '');
  }

  // Test basic connectivity
  async testConnectivity() {
    this.log('Testing basic connectivity to Destatis API...');
    
    try {
      // Test 1: Basic fetch without authentication
      const response = await fetch(`${this.baseURL}/helloworld/whoami`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000
      });

      this.log('Basic connectivity test response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      this.log('Response body (text):', responseText);

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      this.log('Connectivity test failed:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message,
        errorType: error.name
      };
    }
  }

  // Test authentication
  async testAuthentication() {
    this.log('Testing authentication with API key...');
    
    if (!this.isAvailable) {
      this.log('No API key available for authentication test');
      return { success: false, error: 'No API key configured' };
    }

    try {
      // Create Basic Auth header
      const credentials = btoa(`${this.credentials.username}:`);
      
      const response = await fetch(`${this.baseURL}/helloworld/logincheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        timeout: 10000
      });

      this.log('Authentication test response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      this.log('Auth response body:', responseText);

      let parsedResponse = null;
      try {
        parsedResponse = JSON.parse(responseText);
        this.log('Parsed JSON response:', parsedResponse);
      } catch (e) {
        this.log('Response is not JSON, keeping as text');
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        parsedBody: parsedResponse,
        headers: Object.fromEntries(response.headers.entries())
      };

    } catch (error) {
      this.log('Authentication test failed:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message,
        errorType: error.name
      };
    }
  }

  // Test data request with detailed logging
  async testDataRequest(tableCode = '63111-0003') {
    this.log(`Testing data request for table ${tableCode}...`);
    
    if (!this.isAvailable) {
      this.log('No API key available for data request test');
      return { success: false, error: 'No API key configured' };
    }

    try {
      // Prepare form data exactly as in working n8n request
      const formData = new URLSearchParams();
      formData.append('name', tableCode);
      formData.append('area', 'all');
      formData.append('format', 'json');
      formData.append('compress', 'false');
      formData.append('language', 'de');

      this.log('Request parameters:', {
        url: `${this.baseURL}/data/tablefile`,
        method: 'POST',
        tableCode,
        formData: Object.fromEntries(formData.entries())
      });

      // Create Basic Auth header
      const credentials = btoa(`${this.credentials.username}:`);
      
      const response = await fetch(`${this.baseURL}/data/tablefile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        body: formData.toString(),
        timeout: 30000
      });

      this.log('Data request response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      // Get response as text first
      const responseText = await response.text();
      this.log('Raw response body (first 500 chars):', responseText.substring(0, 500));

      let parsedResponse = null;
      let responseType = 'text';

      // Try to parse as JSON
      try {
        parsedResponse = JSON.parse(responseText);
        responseType = 'json';
        this.log('Successfully parsed as JSON');
        
        // Log structure of JSON response
        if (parsedResponse && typeof parsedResponse === 'object') {
          this.log('JSON response structure:', {
            keys: Object.keys(parsedResponse),
            hasObject: !!parsedResponse.Object,
            hasContent: !!(parsedResponse.Object && parsedResponse.Object.Content),
            contentType: parsedResponse.Object?.Content ? typeof parsedResponse.Object.Content : 'none'
          });
        }
      } catch (e) {
        this.log('Response is not JSON, treating as text');
        
        // Check if it might be XML
        if (responseText.trim().startsWith('<')) {
          responseType = 'xml';
          this.log('Response appears to be XML');
        }
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        responseType,
        bodyLength: responseText.length,
        body: responseText,
        parsedBody: parsedResponse,
        headers: Object.fromEntries(response.headers.entries()),
        tableCode
      };

    } catch (error) {
      this.log('Data request test failed:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message,
        errorType: error.name,
        tableCode
      };
    }
  }

  // Test multiple endpoints to understand API structure
  async testMultipleEndpoints() {
    this.log('Testing multiple Destatis endpoints...');
    
    const endpoints = [
      {
        name: 'Who Am I',
        path: '/helloworld/whoami',
        method: 'POST',
        requiresAuth: false
      },
      {
        name: 'Login Check',
        path: '/helloworld/logincheck',
        method: 'POST',
        requiresAuth: true
      },
      {
        name: 'Test Data',
        path: '/helloworld/test',
        method: 'POST',
        requiresAuth: false
      },
      {
        name: 'Catalogue Tables',
        path: '/catalogue/tables',
        method: 'POST',
        requiresAuth: true,
        body: 'selection=*&area=all&format=json'
      }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      this.log(`Testing endpoint: ${endpoint.name}`);
      
      try {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        if (endpoint.requiresAuth && this.isAvailable) {
          const credentials = btoa(`${this.credentials.username}:`);
          headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint.path}`, {
          method: endpoint.method,
          headers,
          body: endpoint.body || '',
          timeout: 10000
        });

        const responseText = await response.text();
        
        results.push({
          endpoint: endpoint.name,
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          bodyPreview: responseText.substring(0, 200),
          headers: Object.fromEntries(response.headers.entries())
        });

        this.log(`Endpoint ${endpoint.name} result:`, {
          status: response.status,
          bodyLength: responseText.length
        });

      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          success: false,
          error: error.message,
          errorType: error.name
        });

        this.log(`Endpoint ${endpoint.name} failed:`, error.message);
      }
    }

    return results;
  }

  // Comprehensive test suite
  async runFullDiagnostic() {
    this.log('Starting full Destatis API diagnostic...');
    
    const results = {
      timestamp: new Date().toISOString(),
      apiKey: this.isAvailable ? 'Configured' : 'Not configured',
      tests: {}
    };

    // Test 1: Basic connectivity
    this.log('=== Test 1: Basic Connectivity ===');
    results.tests.connectivity = await this.testConnectivity();

    // Test 2: Authentication
    this.log('=== Test 2: Authentication ===');
    results.tests.authentication = await this.testAuthentication();

    // Test 3: Multiple endpoints
    this.log('=== Test 3: Multiple Endpoints ===');
    results.tests.endpoints = await this.testMultipleEndpoints();

    // Test 4: Data request
    this.log('=== Test 4: Data Request ===');
    results.tests.dataRequest = await this.testDataRequest('63111-0003');

    // Test 5: Alternative table codes
    this.log('=== Test 5: Alternative Tables ===');
    const alternativeTables = ['63111-0001', '63111-0002', '12411-0001'];
    results.tests.alternativeTables = {};
    
    for (const tableCode of alternativeTables) {
      results.tests.alternativeTables[tableCode] = await this.testDataRequest(tableCode);
    }

    results.debugLog = this.debugLog;
    
    this.log('Full diagnostic completed');
    return results;
  }

  // Get formatted diagnostic report
  getFormattedReport(results) {
    let report = `
# Destatis API Diagnostic Report
Generated: ${results.timestamp}
API Key Status: ${results.apiKey}

## Summary
`;

    // Add test summaries
    Object.entries(results.tests).forEach(([testName, testResult]) => {
      if (Array.isArray(testResult)) {
        report += `\n### ${testName}:\n`;
        testResult.forEach(result => {
          report += `- ${result.endpoint}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'} (${result.status || result.error})\n`;
        });
      } else {
        report += `\n### ${testName}: ${testResult.success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
        if (testResult.status) {
          report += `   Status: ${testResult.status} ${testResult.statusText}\n`;
        }
        if (testResult.error) {
          report += `   Error: ${testResult.error}\n`;
        }
      }
    });

    report += `\n## Detailed Log\n`;
    results.debugLog.forEach(entry => {
      report += `${entry.timestamp}: ${entry.message}\n`;
      if (entry.data) {
        report += `   Data: ${JSON.stringify(entry.data, null, 2)}\n`;
      }
    });

    return report;
  }

  // Export debug log
  exportDebugLog() {
    const logData = {
      timestamp: new Date().toISOString(),
      debugLog: this.debugLog,
      apiKeyConfigured: this.isAvailable
    };

    const dataStr = JSON.stringify(logData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `destatis-debug-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export default new DestAtisDebugger();
// Supabase Verbindungshelfer
import supabase from './supabase';

export const connectSupabaseProject = async (organizationNameOrId, projectNameOrId) => {
  try {
    console.log('🔌 Attempting to connect Supabase project...');
    console.log('Organization:', organizationNameOrId);
    console.log('Project:', projectNameOrId);
    
    // Check if supabase is already connected
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
    }
    
    // Test connection
    const { data, error } = await supabase
      .from('personas_pg2024')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    
    console.log('✅ Supabase connection successful');
    return {
      success: true,
      message: 'Successfully connected to Supabase project',
      projectId: projectNameOrId,
      organizationId: organizationNameOrId
    };
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    throw new Error(`Failed to connect to Supabase: ${error.message}`);
  }
};

export const getSupabaseCredentials = () => {
  try {
    const projectUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!projectUrl || !anonKey || 
        projectUrl === 'https://<PROJECT-ID>.supabase.co' || 
        anonKey === '<ANON_KEY>') {
      throw new Error('Supabase credentials not properly configured');
    }
    
    // Extract project ID from URL
    const projectId = projectUrl.replace('https://', '').replace('.supabase.co', '');
    
    return {
      projectId,
      projectUrl,
      anonKey,
      organizationId: 'default', // Supabase doesn't expose org ID via client
      success: true
    };
    
  } catch (error) {
    throw new Error(`Failed to get Supabase credentials: ${error.message}`);
  }
};
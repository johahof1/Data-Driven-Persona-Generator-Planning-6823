import { createClient } from '@supabase/supabase-js'

// Ihre echten Supabase-Credentials
const SUPABASE_URL = 'https://bbqtxcpqzsqvvsppmcyt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicXR4Y3BxenNxdnZzcHBtY3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDEzNTYsImV4cCI6MjA3MjcxNzM1Nn0.QwEH42qg4j3piYcrDHWs8NynC1DOVjlrqukIip4Gt5w'

// Überprüfung der Credentials
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

// Erstelle Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

console.log('✅ Supabase client initialized successfully')
console.log('📡 Project URL:', SUPABASE_URL)

export default supabase
// lib/script/test-supabase.js
import { createClient } from '@supabase/supabase-js';

// Use environment variables directly
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSupabase() {
  try {
    const { data, error } = await supabase.from('dbTest').select('*');
    
    if (error) throw error;
    
    console.log('✅ Supabase Connected Successfully!');
    console.log('Retrieved Data:', data);
  } catch (err) {
    console.error('❌ Supabase Connection Failed:', err.message);
  }
}

testSupabase();
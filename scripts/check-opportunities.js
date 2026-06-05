const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('id, book_title, saas_name, created_at')
    .limit(10);
    
  if (error) {
    console.error("Error reading database:", error);
  } else {
    console.log("Database opportunities:", data);
  }
}

run();

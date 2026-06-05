const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Note: To delete all rows, we might need a service role key or bypass RLS if there are policies.
// But let's try with the anon client first. If that fails, we can tell the user or see.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Attempting to delete all opportunities from the database to clean up the library...");
  
  const { data, error } = await supabase
    .from('opportunities')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    
  if (error) {
    console.error("Error deleting opportunities:", error);
  } else {
    console.log("Successfully cleared opportunities table.");
  }
}

run();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('matrix_items')
    .select('id, type, name, tier');
    
  if (error) {
    console.error("Error reading database:", error);
    return;
  }

  console.log(`Total database items: ${data.length}`);
  const fs = require('fs');
  fs.writeFileSync('db-items-dump.json', JSON.stringify(data, null, 2));
  console.log("Dumped to db-items-dump.json");
}

run();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { audiences, problems } = require('../src/lib/matrices.ts');

async function run() {
  const { data, error } = await supabase
    .from('matrix_items')
    .select('type, name, tier');
    
  if (error) {
    console.error("Error reading database:", error);
    return;
  }

  const staticAudienceNames = new Set(audiences.map(item => item.name));
  const staticProblemNames = new Set(problems.map(item => item.name));

  const dbAudiences = data.filter(item => item.type === 'audience');
  const dbProblems = data.filter(item => item.type === 'problem');

  console.log("DB audiences not in static list:");
  dbAudiences.forEach(item => {
    if (!staticAudienceNames.has(item.name)) {
      console.log(`  - ${item.name} (Tier ${item.tier})`);
    }
  });

  console.log("\nDB problems not in static list:");
  dbProblems.forEach(item => {
    if (!staticProblemNames.has(item.name)) {
      console.log(`  - ${item.name} (Tier ${item.tier})`);
    }
  });
}

run().catch(console.error);

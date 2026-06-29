const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdvisors() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('id, saas_name, advisor_advice')
    .not('advisor_advice', 'is', null);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${data.length} opportunities with advisor advice:`);
  data.forEach(opp => {
    const advisors = opp.advisor_advice?.advisors || [];
    console.log(`- ${opp.saas_name}: ${advisors.length} advisors (Names: ${advisors.map(a => a.name).join(', ')})`);
  });
}

checkAdvisors();

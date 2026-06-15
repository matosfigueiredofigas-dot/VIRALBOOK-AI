const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfiles() {
  console.log('Querying profiles...');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching profiles:', error);
    process.exit(1);
  }

  console.log('Successfully fetched profiles:');
  console.log(JSON.stringify(data, null, 2));

  if (data && data.length > 0) {
    console.log('Available columns in profiles:', Object.keys(data[0]));
  } else {
    console.log('No profiles found in table.');
  }
}

checkProfiles();

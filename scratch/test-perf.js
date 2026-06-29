const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPerformance() {
  console.log("Starting performance test...");

  // Measure getUser()
  console.time("supabase.auth.getUser() - call 1");
  // We don't have session cookie context in node easily without setting headers, 
  // but we can see the latency of an anonymous request or token parsing.
  // Actually, let's measure fetching metadata or just auth ping.
  // Since we are not authenticated in node, getUser() might return null but it still contacts Supabase.
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  console.timeEnd("supabase.auth.getUser() - call 1");

  console.time("supabase.auth.getUser() - call 2");
  await supabase.auth.getUser();
  console.timeEnd("supabase.auth.getUser() - call 2");

  // 1. Test Select *
  console.time("Select * from opportunities");
  const { data: allOpps, error: err1 } = await supabase
    .from('opportunities')
    .select('*');
  console.timeEnd("Select * from opportunities");
  
  // 2. Test Narrow Select
  console.time("Narrow Select from opportunities");
  const { data: narrowOpps, error: err2 } = await supabase
    .from('opportunities')
    .select('id, created_at, saas_name, problem_solved, viral_opportunity_score, country, trends_growth_monthly, reddit_mentions, facebook_ads_count, facebook_groups_count, target_audience, competitive_advantage, suggested_price, book_category');
  console.timeEnd("Narrow Select from opportunities");
}

testPerformance().catch(console.error);

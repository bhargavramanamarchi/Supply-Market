import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Executing products query without sorting...");
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      suppliers(*)
    `);

  if (error) {
    console.error("Products query failed!");
    console.error("error.code:", error.code);
    console.error("error.message:", error.message);
    console.error("error.details:", error.details);
    console.error("error.hint:", error.hint);
  } else {
    console.log("Success! Count of products:", data.length);
    if (data.length > 0) {
      console.log("First product sample:", JSON.stringify(data[0], null, 2));
    }
  }
}

run();

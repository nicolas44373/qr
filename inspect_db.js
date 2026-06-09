const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
    env[match[1]] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('club_orders').insert([{
    user_dni: null,
    items: [{ id: 999, name: 'TEST PRODUCT', price: 100, quantity: 1 }],
    total: 100,
    status: 'Pendiente',
    points_awarded: false
  }]).select();
  
  if (error) {
    console.error('Error inserting with null user_dni:', error);
  } else {
    console.log('Successfully inserted order with null user_dni:', data);
    // Clean up
    await supabase.from('club_orders').delete().eq('id', data[0].id);
    console.log('Cleaned up test order.');
  }
}

run();

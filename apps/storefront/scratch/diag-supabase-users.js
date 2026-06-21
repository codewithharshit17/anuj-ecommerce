const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error("Error:", error); return; }
  
  console.log("=== ALL SUPABASE AUTH USERS ===");
  users.forEach(u => {
    console.log(`  ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Email Confirmed: ${u.email_confirmed_at ? 'YES at ' + u.email_confirmed_at : 'NO'}`);
    console.log(`  Last Sign In: ${u.last_sign_in_at || 'NEVER'}`);
    console.log(`  Providers: ${u.app_metadata?.providers?.join(', ') || u.app_metadata?.provider || 'unknown'}`);
    console.log(`  Metadata first_name: ${u.user_metadata?.first_name || '(none)'}`);
    console.log(`  Metadata last_name: ${u.user_metadata?.last_name || '(none)'}`);
    console.log(`  Metadata full_name: ${u.user_metadata?.full_name || '(none)'}`);
    console.log(`  Identities count: ${u.identities?.length ?? 'null'}`);
    if (u.identities && u.identities.length > 0) {
      u.identities.forEach(id => {
        console.log(`    Identity provider: ${id.provider}, id: ${id.id}`);
      });
    }
    console.log('  ---');
  });
}

main();

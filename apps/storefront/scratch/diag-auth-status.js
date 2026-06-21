const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Check if a new email signup actually created a confirmed user by checking fake user
  // The real diagnostic: try signing up with a dummy email and see what happens
  
  // Let's check all users' email_confirmed_at status to understand confirmation flow
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error("Error:", error); return; }
  
  console.log("=== CONFIRMATION STATUS CHECK ===");
  users.forEach(u => {
    const isConfirmed = !!u.email_confirmed_at;
    const provider = u.app_metadata?.provider;
    const providers = u.app_metadata?.providers;
    console.log(`  ${u.email}:`);
    console.log(`    Confirmed: ${isConfirmed}`);
    console.log(`    Provider: ${provider}`);
    console.log(`    Providers: ${JSON.stringify(providers)}`);
    console.log(`    Created: ${u.created_at}`);
    console.log(`    Confirmed At: ${u.email_confirmed_at || 'NEVER'}`);
    console.log(`    Last Sign In: ${u.last_sign_in_at || 'NEVER'}`);
    console.log('  ---');
  });

  // KEY CHECK: Are all 3 existing users ONLY Google OAuth?
  // If yes, then there are NO email/password users at all
  console.log("\n=== KEY FINDING ===");
  const emailPasswordUsers = users.filter(u => {
    const providers = u.app_metadata?.providers || [];
    return providers.includes('email');
  });
  console.log(`Email/password users: ${emailPasswordUsers.length}`);
  console.log(`All users are Google OAuth only: ${emailPasswordUsers.length === 0 ? 'YES' : 'NO'}`);
  
  // Check if any user has identities
  for (const u of users) {
    const { data: identities } = await supabase.auth.admin.getUserById(u.id);
    if (identities?.user?.identities) {
      console.log(`\n  ${u.email} identities:`);
      identities.user.identities.forEach(id => {
        console.log(`    Provider: ${id.provider}, Identity ID: ${id.id}, Created: ${id.created_at}`);
      });
    }
  }
}

main();

/**
 * Test what Supabase returns when creating a user with email_confirm: false
 * (simulating what the signup action experiences) vs admin create with email_confirm: true.
 * Also check Supabase project config for autoconfirm setting.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const testEmail = `diagadmin${Date.now()}@test.com`;

  console.log("=== ADMIN CREATE USER (autoconfirm) ===");
  const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: 'TestPassword123!',
    email_confirm: true, // Explicitly confirm
    user_metadata: {
      first_name: 'Admin',
      last_name: 'Test',
    },
  });

  if (adminError) {
    console.log(`  ERROR: ${adminError.message}`);
  } else {
    console.log(`  user.id: ${adminData.user?.id}`);
    console.log(`  user.email_confirmed_at: ${adminData.user?.email_confirmed_at}`);
    
    // Now try to sign in with this confirmed user
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    console.log("\n=== SIGN IN WITH CONFIRMED USER ===");
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: testEmail,
      password: 'TestPassword123!',
    });
    
    if (signInError) {
      console.log(`  ERROR: ${signInError.message}`);
    } else {
      console.log(`  session: ${signInData.session ? 'PRESENT (login works when confirmed)' : 'NULL'}`);
      console.log(`  user.id: ${signInData.user?.id}`);
    }

    // Clean up
    await adminClient.auth.admin.deleteUser(adminData.user.id);
    console.log('  Cleanup: done');
  }

  // KEY QUESTION: Does the normal signUp flow with anon key 
  // require email confirmation?
  // Since we hit rate limit, let's check the project settings via REST API
  console.log("\n=== CHECKING PROJECT AUTH SETTINGS ===");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const ref = url.match(/https?:\/\/([^.]+)\./)?.[1];
  console.log(`  Supabase project ref: ${ref}`);
  console.log("  NOTE: Check Supabase Dashboard → Auth → Settings → 'Confirm email' toggle");
  console.log("  If 'Confirm email' is ON, then signUp() returns user but NO session.");
  console.log("  The app's signup action does redirect('/') anyway → user has no session.");
  console.log("  This explains why email signup 'succeeds' but user appears unauthenticated.");
}

main();

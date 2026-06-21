const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const testEmail = `diagtest${Date.now()}@gmail.com`;
  
  console.log("=== SIMULATING EMAIL SIGNUP ===");
  console.log(`  Email: ${testEmail}`);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword123!',
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
      },
    },
  });

  console.log("\n=== SIGNUP RESPONSE ===");
  if (error) {
    console.log(`  ERROR: ${error.message}`);
    console.log(`  Status: ${error.status}`);
    console.log(`  Full error:`, JSON.stringify(error, null, 2));
    return;
  }

  console.log(`  user.id: ${data.user?.id || 'null'}`);
  console.log(`  user.email: ${data.user?.email || 'null'}`);
  console.log(`  user.email_confirmed_at: ${data.user?.email_confirmed_at || 'null (UNCONFIRMED)'}`);
  console.log(`  user.role: ${data.user?.role || 'null'}`);
  console.log(`  user.identities count: ${data.user?.identities?.length ?? 'null'}`);
  console.log(`  session: ${data.session ? 'PRESENT' : 'NULL (no session = email confirmation required)'}`);
  
  if (data.session) {
    console.log(`  session.access_token exists: YES`);
  }

  console.log("\n=== KEY FINDING ===");
  if (!data.session && data.user) {
    console.log("  *** EMAIL CONFIRMATION IS REQUIRED ***");
    console.log("  Supabase created the user but did NOT return a session.");
    console.log("  The signup Server Action calls redirect('/') but no auth cookies are set.");
    console.log("  The client-side AuthProvider sees NO session → user appears unauthenticated.");
    console.log("  THIS IS THE ROOT CAUSE of the email/password auth bug.");
  } else if (data.session) {
    console.log("  Email confirmation NOT required. Session created immediately.");
  }

  // Clean up
  if (data.user?.id) {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    await adminClient.auth.admin.deleteUser(data.user.id);
    console.log(`  Cleanup: Test user deleted`);
  }
}

main();

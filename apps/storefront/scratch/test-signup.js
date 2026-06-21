const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const email = 'hj7545498@gmail.com';
  const password = 'Password123';
  console.log(`Attempting to sign up user: ${email}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
      },
    },
  });

  if (error) {
    console.error("SignUp Error:", error);
  } else {
    console.log("SignUp Success:");
    console.log(JSON.stringify(data, null, 2));
  }
}

main();

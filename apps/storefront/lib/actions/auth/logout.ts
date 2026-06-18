/**
 * logout.ts — Server Action
 *
 * Signs the user out of Supabase Auth and redirects to the homepage.
 * The Supabase SSR middleware will automatically clear session cookies.
 */
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * admin-logout.ts — Server Action
 *
 * Signs the admin user out of Supabase Auth and redirects to the
 * dedicated admin login page (not the storefront homepage).
 */
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function adminLogout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

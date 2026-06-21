import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserToPrisma } from "@/lib/auth/sync-user";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);

    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { data } = await supabase.auth.exchangeCodeForSession(code);
        if (data?.user) {
            await syncUserToPrisma(data.user);
        }
    }

    return NextResponse.redirect(`${origin}${next}`);
}
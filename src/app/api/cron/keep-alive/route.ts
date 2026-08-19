import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Optional: Validate Authorization Bearer token from Vercel Cron
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Fetch exactly 1 row to keep the database active and warm
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, slug, is_published, updated_at")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[Cron 07:00 AM] Supabase fetch error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Daily 07:00 AM Cron fetch completed successfully (1 row fetched).",
      timestamp: new Date().toISOString(),
      data: data || null,
    });
  } catch (err: any) {
    console.error("[Cron 07:00 AM] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error during daily cron fetch.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

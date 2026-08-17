import { NextResponse } from "next/server";
import { bacaStatistik } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const statistik = await bacaStatistik();
    return NextResponse.json(statistik, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ralat: "Tidak dapat memuatkan statistik." },
      { status: 500 },
    );
  }
}

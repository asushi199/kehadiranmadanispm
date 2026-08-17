import { NextResponse } from "next/server";
import { senaraiKehadiran } from "@/lib/db";
import { pinSah } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!process.env.ADMIN_PIN) {
    return NextResponse.json(
      { ralat: "ADMIN_PIN belum ditetapkan." },
      { status: 503 },
    );
  }

  const pin = new URL(request.url).searchParams.get("pin");
  if (!pinSah(pin)) {
    return NextResponse.json({ ralat: "PIN tidak sah." }, { status: 401 });
  }

  try {
    const rows = await senaraiKehadiran();
    return NextResponse.json(
      { rows },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ralat: "Tidak dapat memuatkan rekod." },
      { status: 500 },
    );
  }
}

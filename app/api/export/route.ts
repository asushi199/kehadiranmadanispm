import { NextResponse } from "next/server";
import { senaraiKehadiran } from "@/lib/db";
import { KATEGORI_LABEL } from "@/lib/kategori";
import { pinSah } from "@/lib/validate";

export const dynamic = "force-dynamic";

function csvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function formatMasa(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ms-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

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
    const lines = [
      "Nama,Kategori,Masa",
      ...rows.map(
        (row) =>
          `${csvCell(row.nama)},${csvCell(KATEGORI_LABEL[row.kategori])},${csvCell(formatMasa(row.created_at))}`,
      ),
    ];
    const csv = `\uFEFF${lines.join("\n")}`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="kehadiran-spm.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ralat: "Tidak dapat mengeksport data." },
      { status: 500 },
    );
  }
}

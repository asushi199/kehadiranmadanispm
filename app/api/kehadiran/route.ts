import { NextResponse } from "next/server";
import { tambahKehadiran } from "@/lib/db";
import { normaliseNama, parseKategori } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ralat: "Data tidak sah." },
      { status: 400 },
    );
  }

  const payload = body as {
    nama?: unknown;
    kategori?: unknown;
    laman_web?: unknown;
  };

  if (typeof payload.laman_web === "string" && payload.laman_web.trim()) {
    return NextResponse.json({ ok: true });
  }

  const nama = normaliseNama(payload.nama);
  if (nama.length < 2) {
    return NextResponse.json(
      { ralat: "Sila isi nama (sekurang-kurangnya 2 huruf)." },
      { status: 400 },
    );
  }
  if (nama.length > 80) {
    return NextResponse.json(
      { ralat: "Nama terlalu panjang." },
      { status: 400 },
    );
  }

  const kategori = parseKategori(payload.kategori);
  if (!kategori) {
    return NextResponse.json(
      { ralat: "Sila pilih kategori." },
      { status: 400 },
    );
  }

  try {
    const rekod = await tambahKehadiran(nama, kategori);
    return NextResponse.json({ ok: true, id: rekod.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ralat: "Tidak dapat menyimpan kehadiran. Sila cuba lagi." },
      { status: 500 },
    );
  }
}

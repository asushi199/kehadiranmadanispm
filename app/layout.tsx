import type { Metadata } from "next";
import {
  Orbitron,
  Rajdhani,
} from "next/font/google";
import "./globals.css";

const paparan = Orbitron({
  variable: "--font-paparan",
  subsets: ["latin"],
  display: "swap",
});

const badan = Rajdhani({
  variable: "--font-badan",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kehadiran SPM | Karnival Pendidikan Madani Daerah Manjung",
  description:
    "Daftar kehadiran gerai Sektor Pembangunan Murid semasa Karnival Pendidikan Madani Daerah Manjung.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ms"
      className={`${paparan.variable} ${badan.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

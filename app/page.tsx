import { DaftarForm } from "@/components/DaftarForm";
import { LatarKarnival } from "@/components/LatarKarnival";
import { TajukKarnival } from "@/components/TajukKarnival";

export default function Page() {
  return (
    <LatarKarnival className="daftar">
      <div className="daftar-isi">
        <TajukKarnival />
        <p className="daftar-spm">Daftar Kehadiran</p>
        <DaftarForm />
      </div>
    </LatarKarnival>
  );
}

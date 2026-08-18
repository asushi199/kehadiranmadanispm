export function TajukKarnival({ padat = false }: { padat?: boolean }) {
  return (
    <div className={`kepala-tajuk${padat ? " padat" : ""}`}>
      <img
        className="kepala-kpm"
        src="/logo-kpm.png"
        alt="Kementerian Pendidikan"
        width={1024}
        height={575}
      />
      <p className="kepala-acara">
        <span className="kepala-emas">Karnival</span>{" "}
        <span className="kepala-putih">Pendidikan</span>{" "}
        <span className="kepala-emas">Madani</span>
      </p>
      <p className="kepala-daerah">Daerah Manjung</p>
      <img
        className="kepala-spm-logo"
        src="/logo-spm.png"
        alt="Sektor Pembangunan Murid, Unit Pembangunan Bakat Murid, Unit Hal Ehwal Murid"
        width={1024}
        height={343}
      />
      <p className="kepala-spm">
        <span className="spm-lencana">SPM</span>
        <span className="spm-nama">Sektor Pembangunan Murid</span>
      </p>
    </div>
  );
}

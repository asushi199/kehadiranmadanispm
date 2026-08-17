import type { ReactNode } from "react";

function AtomIkon() {
  return (
    <svg className="latar-ikon latar-ikon-kiri" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="22" ry="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="32" cy="32" rx="22" ry="8" fill="none" stroke="currentColor" strokeWidth="2.2" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="22" ry="8" fill="none" stroke="currentColor" strokeWidth="2.2" transform="rotate(-60 32 32)" />
      <circle cx="32" cy="32" r="4.5" fill="currentColor" />
    </svg>
  );
}

function BukuIkon() {
  return (
    <svg className="latar-ikon latar-ikon-kanan" viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M10 16c8 0 14-4 22-4s14 4 22 4v32c-8 0-14-4-22-4s-14 4-22 4V16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path d="M32 12v32" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function Litar() {
  return (
    <svg className="latar-litar" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="#1aa6ff" strokeWidth="1.4" opacity="0.55">
        <path d="M40 80h160v60h90" />
        <path d="M1160 80h-170v70h-80" />
        <path d="M40 720h180v-80h120" />
        <path d="M1160 720h-190v-70h-90" />
        <path d="M220 140h80v40h140" />
        <path d="M980 150h-90v50h-130" />
        <path d="M90 240v120h70" />
        <path d="M1110 250v140h-80" />
        <path d="M70 520h110v90" />
        <path d="M1130 500h-130v100" />
      </g>
      <g fill="#00d4ff">
        <circle cx="200" cy="80" r="3.5" />
        <circle cx="290" cy="140" r="3.5" />
        <circle cx="990" cy="80" r="3.5" />
        <circle cx="890" cy="200" r="3.5" />
        <circle cx="160" cy="640" r="3.5" />
        <circle cx="970" cy="650" r="3.5" />
        <circle cx="90" cy="360" r="3.5" />
        <circle cx="1030" cy="390" r="3.5" />
      </g>
    </svg>
  );
}

export function LatarKarnival({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`latar ${className}`.trim()}>
      <div className="latar-sinaran" aria-hidden="true" />
      <Litar />
      <div className="latar-bingkai">
        <AtomIkon />
        <BukuIkon />
        {children}
      </div>
    </div>
  );
}

"use client";

export function PapanTindakan() {
  return (
    <div className="papan-tindakan">
      <button
        type="button"
        className="btn-penuh"
        onClick={() => {
          if (document.fullscreenElement) {
            void document.exitFullscreen();
          } else {
            void document.documentElement.requestFullscreen();
          }
        }}
      >
        Skrin penuh
      </button>
    </div>
  );
}

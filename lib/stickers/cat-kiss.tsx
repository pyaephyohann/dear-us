// DearUs Cat Sticker — Cat Kiss 🐱💋

"use client";

export function CatKissSticker() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Flying kiss heart */}
      <g className="sticker-float-1">
        <path
          d="M82 22c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5c0 4-5.5 7.5-5.5 7.5s-5.5-3.5-5.5-7.5z"
          fill="#f8a4b8"
        />
      </g>

      {/* Cat body */}
      <ellipse cx="60" cy="72" rx="28" ry="24" fill="#f5d5c8" />

      {/* Cat head */}
      <circle cx="60" cy="48" r="22" fill="#f5d5c8" />

      {/* Ears */}
      <path d="M42 32 L38 14 L52 26Z" fill="#f5d5c8" />
      <path d="M78 32 L82 14 L68 26Z" fill="#f5d5c8" />
      <path d="M44 30 L41 18 L51 27Z" fill="#f0b0a0" />
      <path d="M76 30 L79 18 L69 27Z" fill="#f0b0a0" />

      {/* Eyes — winking */}
      <circle cx="52" cy="45" r="3" fill="#5a3a42" />
      <circle cx="53" cy="44" r="1" fill="white" />
      <path d="M65 45 Q68 42 71 45" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="46" cy="52" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />
      <ellipse cx="73" cy="52" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />

      {/* Nose */}
      <path d="M58 50 L60 53 L62 50Z" fill="#e88a9a" />

      {/* Kiss mouth — puckered */}
      <circle cx="62" cy="56" r="3" fill="#e88a9a" opacity="0.7" />

      {/* Whiskers */}
      <line x1="36" y1="48" x2="48" y2="50" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="36" y1="52" x2="48" y2="52" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="72" y1="50" x2="84" y2="48" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="72" y1="52" x2="84" y2="52" stroke="#c4a8a0" strokeWidth="1" />

      {/* Paws */}
      <ellipse cx="46" cy="92" rx="8" ry="5" fill="#f5d5c8" />
      <ellipse cx="74" cy="92" rx="8" ry="5" fill="#f5d5c8" />

      {/* Tail */}
      <path
        d="M88 72 Q98 60 95 48"
        stroke="#f5d5c8"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        className="sticker-wag"
      />
    </svg>
  );
}

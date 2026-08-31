// DearUs Cat Sticker — Cat Happy 🐱✨

"use client";

export function CatHappySticker() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Sparkles */}
      <g className="sticker-sparkle-1">
        <path d="M20 20 L22 16 L24 20 L28 22 L24 24 L22 28 L20 24 L16 22Z" fill="#f8c4c8" opacity="0.7" />
      </g>
      <g className="sticker-sparkle-2">
        <path d="M95 30 L96.5 27 L98 30 L101 31.5 L98 33 L96.5 36 L95 33 L92 31.5Z" fill="#f8c4c8" opacity="0.5" />
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

      {/* Eyes — big happy */}
      <circle cx="52" cy="45" r="3.5" fill="#5a3a42" />
      <circle cx="68" cy="45" r="3.5" fill="#5a3a42" />
      <circle cx="53" cy="44" r="1.2" fill="white" />
      <circle cx="69" cy="44" r="1.2" fill="white" />

      {/* Blush */}
      <ellipse cx="46" cy="52" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />
      <ellipse cx="74" cy="52" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />

      {/* Nose */}
      <path d="M58 50 L60 53 L62 50Z" fill="#e88a9a" />

      {/* Big smile */}
      <path d="M52 54 Q60 62 68 54" stroke="#5a3a42" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="36" y1="48" x2="48" y2="50" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="36" y1="52" x2="48" y2="52" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="72" y1="50" x2="84" y2="48" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="72" y1="52" x2="84" y2="52" stroke="#c4a8a0" strokeWidth="1" />

      {/* Paws raised up */}
      <ellipse cx="38" cy="74" rx="7" ry="5" fill="#f5d5c8" transform="rotate(-20 38 74)" />
      <ellipse cx="82" cy="74" rx="7" ry="5" fill="#f5d5c8" transform="rotate(20 82 74)" />

      {/* Tail */}
      <path
        d="M88 72 Q98 58 92 46"
        stroke="#f5d5c8"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        className="sticker-wag"
      />
    </svg>
  );
}

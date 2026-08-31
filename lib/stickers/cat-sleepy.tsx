// DearUs Cat Sticker — Cat Sleepy 🐱💤

"use client";

export function CatSleepySticker() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Zzz bubbles */}
      <g className="sticker-float-2">
        <text x="88" y="28" fontSize="10" fill="#c4a8a0" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">z</text>
      </g>
      <g className="sticker-float-1">
        <text x="96" y="18" fontSize="7" fill="#c4a8a0" fontFamily="sans-serif" fontWeight="bold" opacity="0.4">z</text>
      </g>

      {/* Cat body — curled up */}
      <ellipse cx="60" cy="76" rx="30" ry="22" fill="#f5d5c8" />

      {/* Cat head — resting */}
      <circle cx="55" cy="52" r="20" fill="#f5d5c8" />

      {/* Ears */}
      <path d="M39 36 L36 20 L48 30Z" fill="#f5d5c8" />
      <path d="M71 36 L74 20 L62 30Z" fill="#f5d5c8" />
      <path d="M41 34 L38 22 L47 31Z" fill="#f0b0a0" />
      <path d="M69 34 L72 22 L63 31Z" fill="#f0b0a0" />

      {/* Eyes — closed sleeping */}
      <path d="M45 50 Q48 47 51 50" stroke="#5a3a42" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M59 50 Q62 47 65 50" stroke="#5a3a42" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="42" cy="54" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />
      <ellipse cx="68" cy="54" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />

      {/* Nose */}
      <path d="M53 52 L55 55 L57 52Z" fill="#e88a9a" />

      {/* Small sleep smile */}
      <path d="M51 56 Q55 58 59 56" stroke="#5a3a42" strokeWidth="1.3" fill="none" strokeLinecap="round" />

      {/* Tail curled around body */}
      <path
        d="M88 76 Q95 68 90 58"
        stroke="#f5d5c8"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Paw tucked under chin */}
      <ellipse cx="40" cy="68" rx="7" ry="4" fill="#f5d5c8" />
    </svg>
  );
}

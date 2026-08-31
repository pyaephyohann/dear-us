// DearUs Cat Sticker — Cat Love 🐱💕
// A cute cat with floating hearts

"use client";

export function CatLoveSticker() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Floating hearts */}
      <g className="sticker-float-1">
        <path
          d="M85 25c0-3.5 3-6.5 6.5-6.5s6.5 3 6.5 6.5c0 5-6.5 9-6.5 9s-6.5-4-6.5-9z"
          fill="#f8a4b8"
          opacity="0.8"
        />
      </g>
      <g className="sticker-float-2">
        <path
          d="M28 30c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 3.5-4.5 6.5-4.5 6.5s-4.5-3-4.5-6.5z"
          fill="#f8a4b8"
          opacity="0.6"
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

      {/* Eyes — happy closed */}
      <path d="M50 46 Q53 42 56 46" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M64 46 Q67 42 70 46" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="47" cy="52" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />
      <ellipse cx="73" cy="52" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />

      {/* Nose */}
      <path d="M58 50 L60 53 L62 50Z" fill="#e88a9a" />

      {/* Mouth */}
      <path d="M56 54 Q60 58 64 54" stroke="#5a3a42" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="36" y1="48" x2="48" y2="50" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="36" y1="52" x2="48" y2="52" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="72" y1="50" x2="84" y2="48" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="72" y1="52" x2="84" y2="52" stroke="#c4a8a0" strokeWidth="1" />

      {/* Paws */}
      <ellipse cx="46" cy="92" rx="8" ry="5" fill="#f5d5c8" />
      <ellipse cx="74" cy="92" rx="8" ry="5" fill="#f5d5c8" />
      <circle cx="43" cy="91" r="2" fill="#f0b0a0" opacity="0.5" />
      <circle cx="46" cy="89" r="2" fill="#f0b0a0" opacity="0.5" />
      <circle cx="49" cy="91" r="2" fill="#f0b0a0" opacity="0.5" />
      <circle cx="71" cy="91" r="2" fill="#f0b0a0" opacity="0.5" />
      <circle cx="74" cy="89" r="2" fill="#f0b0a0" opacity="0.5" />
      <circle cx="77" cy="91" r="2" fill="#f0b0a0" opacity="0.5" />

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

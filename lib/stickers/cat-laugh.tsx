// DearUs Cat Sticker — Cat Laugh 🐱😂

"use client";

export function CatLaughSticker() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Laugh tears */}
      <g className="sticker-float-2">
        <ellipse cx="38" cy="42" rx="2" ry="3" fill="#a8d8ea" opacity="0.6" />
      </g>

      {/* Cat body — shaking */}
      <ellipse cx="60" cy="72" rx="28" ry="24" fill="#f5d5c8" className="sticker-shake" />

      {/* Cat head */}
      <circle cx="60" cy="48" r="22" fill="#f5d5c8" className="sticker-shake" />

      {/* Ears */}
      <path d="M42 32 L38 14 L52 26Z" fill="#f5d5c8" />
      <path d="M78 32 L82 14 L68 26Z" fill="#f5d5c8" />
      <path d="M44 30 L41 18 L51 27Z" fill="#f0b0a0" />
      <path d="M76 30 L79 18 L69 27Z" fill="#f0b0a0" />

      {/* Eyes — squinting from laughing */}
      <path d="M48 45 Q53 41 58 45" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M62 45 Q67 41 72 45" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="46" cy="50" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />
      <ellipse cx="74" cy="50" rx="4" ry="2.5" fill="#f0b0a0" opacity="0.5" />

      {/* Nose */}
      <path d="M58 50 L60 53 L62 50Z" fill="#e88a9a" />

      {/* Big open laugh */}
      <path d="M50 55 Q60 65 70 55" stroke="#5a3a42" strokeWidth="1.8" fill="#fde8e0" strokeLinecap="round" />

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
        d="M88 72 Q100 58 94 46"
        stroke="#f5d5c8"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        className="sticker-wag"
      />
    </svg>
  );
}

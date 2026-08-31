// DearUs Cat Sticker — Cat Shy 🐱💗

"use client";

export function CatShySticker() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Cat body */}
      <ellipse cx="60" cy="72" rx="28" ry="24" fill="#f5d5c8" />

      {/* Cat head — slightly tilted */}
      <circle cx="60" cy="48" r="22" fill="#f5d5c8" />

      {/* Ears */}
      <path d="M42 32 L38 14 L52 26Z" fill="#f5d5c8" />
      <path d="M78 32 L82 14 L68 26Z" fill="#f5d5c8" />
      <path d="M44 30 L41 18 L51 27Z" fill="#f0b0a0" />
      <path d="M76 30 L79 18 L69 27Z" fill="#f0b0a0" />

      {/* Eyes — looking down shyly */}
      <path d="M50 47 Q53 44 56 47" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M64 47 Q67 44 70 47" stroke="#5a3a42" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Big blush spots */}
      <ellipse cx="45" cy="52" rx="5" ry="3" fill="#f0b0a0" opacity="0.6" />
      <ellipse cx="75" cy="52" rx="5" ry="3" fill="#f0b0a0" opacity="0.6" />

      {/* Nose */}
      <path d="M58 50 L60 53 L62 50Z" fill="#e88a9a" />

      {/* Small shy smile */}
      <path d="M56 55 Q60 57 64 55" stroke="#5a3a42" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Paw covering face */}
      <ellipse cx="72" cy="56" rx="7" ry="5" fill="#f5d5c8" transform="rotate(-15 72 56)" className="sticker-peek" />

      {/* Whiskers */}
      <line x1="36" y1="48" x2="48" y2="50" stroke="#c4a8a0" strokeWidth="1" />
      <line x1="36" y1="52" x2="48" y2="52" stroke="#c4a8a0" strokeWidth="1" />

      {/* Paws */}
      <ellipse cx="46" cy="92" rx="8" ry="5" fill="#f5d5c8" />
      <ellipse cx="74" cy="92" rx="8" ry="5" fill="#f5d5c8" />

      {/* Tail curled */}
      <path
        d="M88 72 Q96 62 90 52"
        stroke="#f5d5c8"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

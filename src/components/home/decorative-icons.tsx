// Large-scale decorative line art, same hand-drawn stroke style as
// gallery-icons.tsx, just scaled up for use as a faint background flourish
// rather than a small UI icon.
export function OliveBranchIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M20 205C70 180 110 150 140 115C165 85 180 55 190 20" />
      <path d="M118 148C140 132 162 124 188 122" />
      <path d="M150 110C168 100 186 96 206 98" />

      <ellipse cx="44" cy="190" rx="13" ry="6.5" transform="rotate(-35 44 190)" />
      <ellipse cx="70" cy="170" rx="13" ry="6.5" transform="rotate(-40 70 170)" />
      <ellipse cx="98" cy="146" rx="12" ry="6" transform="rotate(-42 98 146)" />
      <ellipse cx="126" cy="122" rx="12" ry="6" transform="rotate(-38 126 122)" />
      <ellipse cx="152" cy="98" rx="11" ry="5.5" transform="rotate(-44 152 98)" />
      <ellipse cx="174" cy="68" rx="11" ry="5.5" transform="rotate(-50 174 68)" />
      <ellipse cx="186" cy="38" rx="10" ry="5" transform="rotate(-55 186 38)" />

      <ellipse cx="148" cy="138" rx="11" ry="5.5" transform="rotate(10 148 138)" />
      <ellipse cx="172" cy="130" rx="10" ry="5" transform="rotate(12 172 130)" />
      <ellipse cx="195" cy="118" rx="10" ry="5" transform="rotate(8 195 118)" />

      <ellipse cx="178" cy="100" rx="9" ry="4.5" transform="rotate(-15 178 100)" />
      <ellipse cx="198" cy="94" rx="9" ry="4.5" transform="rotate(-10 198 94)" />

      <circle cx="60" cy="183" r="4" />
      <circle cx="112" cy="134" r="4" />
      <circle cx="164" cy="90" r="3.5" />
      <circle cx="190" cy="108" r="3.5" />
    </svg>
  );
}

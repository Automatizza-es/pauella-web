const shared = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FlameGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M12 21c3.3 0 5.8-2.3 5.8-5.6 0-2.6-1.6-4.3-2.7-6 .1 1.8-1.2 2.9-1.2 2.9.5-2.6-.8-4.4-2.7-5.5.4 2.3-1 3.7-2.3 5.4-.9 1.2-1.3 2.3-1.3 3.2C7.6 18.7 8.7 21 12 21Z" />
    </svg>
  );
}

export function OliveBranchGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M12 20V9c0-3.3 2.3-5.6 5.5-5.6-1 4.4-3.2 5.6-5.5 6.6" />
      <ellipse cx="15.5" cy="7.5" rx="1.9" ry="1.1" transform="rotate(-35 15.5 7.5)" />
      <ellipse cx="13" cy="11.5" rx="1.9" ry="1.1" transform="rotate(-35 13 11.5)" />
      <ellipse cx="12" cy="16" rx="1.9" ry="1.1" transform="rotate(-20 12 16)" />
    </svg>
  );
}

export function SunGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5M18.1 18.1l-1.5-1.5M7.4 7.4 5.9 5.9" />
    </svg>
  );
}

export function PanGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <ellipse cx="12" cy="13" rx="8" ry="4.2" />
      <path d="M4 13v1.4C4 17 7.6 19 12 19s8-2 8-4.6V13" />
      <path d="M3 11.5h2.5M18.5 11.5H21" />
    </svg>
  );
}

export function SpoonGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <ellipse cx="9.5" cy="6.5" rx="3.3" ry="4.2" transform="rotate(-18 9.5 6.5)" />
      <path d="M11.6 9.6 19 20" />
    </svg>
  );
}

export function GrainGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <ellipse cx="9" cy="9" rx="2.6" ry="1.5" transform="rotate(-30 9 9)" />
      <ellipse cx="15.5" cy="8" rx="2.4" ry="1.3" transform="rotate(15 15.5 8)" />
      <ellipse cx="12" cy="15.5" rx="2.6" ry="1.4" transform="rotate(-10 12 15.5)" />
      <ellipse cx="6.5" cy="15.5" rx="2.1" ry="1.2" transform="rotate(30 6.5 15.5)" />
    </svg>
  );
}

export function PeopleGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <circle cx="8.5" cy="8" r="2.8" />
      <path d="M3.5 19c0-3.2 2.2-5.3 5-5.3s5 2.1 5 5.3" />
      <circle cx="16.3" cy="9.3" r="2.2" />
      <path d="M13.2 19c.2-2.5 1.8-4 3.4-4s3 1.3 3.4 3.4" />
    </svg>
  );
}

export function RecipeGlyph() {
  return (
    <svg {...shared} aria-hidden>
      <rect x="5" y="3.2" width="14" height="17.6" rx="1.6" />
      <path d="M8 7.5h8M8 11h8M8 14.5h5" />
    </svg>
  );
}


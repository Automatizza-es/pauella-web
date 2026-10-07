const shared = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrivalIcon() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M3 15.5V8.2A1.2 1.2 0 0 1 4.2 7h8.3v8.5H4.2A1.2 1.2 0 0 1 3 15.5Z" />
      <path d="M12.5 10h3.2l2.8 2.8v2.7h-6" />
      <circle cx="7" cy="17.3" r="1.5" />
      <circle cx="16" cy="17.3" r="1.5" />
    </svg>
  );
}

export function PreparationIcon() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M4.5 12a7.5 7.5 0 0 0 15 0" />
      <path d="M4.5 12h15" />
      <path d="M9.5 12V5.2" />
      <ellipse cx="9.5" cy="4" rx="1.6" ry="2.2" />
    </svg>
  );
}

export function LiveCookingIcon() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M12 21c3.3 0 5.8-2.3 5.8-5.6 0-2.6-1.6-4.3-2.7-6 .1 1.8-1.2 2.9-1.2 2.9.5-2.6-.8-4.4-2.7-5.5.4 2.3-1 3.7-2.3 5.4-.9 1.2-1.3 2.3-1.3 3.2C7.6 18.7 8.7 21 12 21Z" />
    </svg>
  );
}

export function ServingIcon() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M4 15.5a8 8 0 0 1 16 0" />
      <path d="M3 15.5h18" />
      <path d="M12 7.3v2" />
      <circle cx="12" cy="5.6" r="1.3" />
    </svg>
  );
}

export function MomentIcon() {
  return (
    <svg {...shared} aria-hidden>
      <path d="M7 4h4l-.6 5a1.4 1.4 0 0 1-2.8 0L7 4Z" />
      <path d="M9 9v9M7 18h4" />
      <path d="M14 4h4l-.6 5a1.4 1.4 0 0 1-2.8 0L14 4Z" />
      <path d="M16 9v9M14 18h4" />
    </svg>
  );
}

export const experienceIcons = [
  ArrivalIcon,
  PreparationIcon,
  LiveCookingIcon,
  ServingIcon,
  MomentIcon,
];

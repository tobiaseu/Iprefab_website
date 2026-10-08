type P = { className?: string };

export function LogoMark({ className }: P) {
  return (
    <svg viewBox="26 44 146 102" className={className} fill="currentColor" aria-hidden>
      <path d="M26 100 68 64v36H26Z" />
      <path d="M80 44v56h92L80 44Z" />
      <rect x="42" y="112" width="26" height="34" />
      <rect x="80" y="112" width="70" height="34" />
    </svg>
  );
}

export function UserIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="12" fill="white" />
      <circle cx="12" cy="9.5" r="4" fill="#787878" />
      <path d="M4.5 19.5c1.8-3 4.4-4.5 7.5-4.5s5.7 1.5 7.5 4.5A11 11 0 0 1 12 23a11 11 0 0 1-7.5-3.5Z" fill="#787878" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: P & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.2 0 3.6 1.2 5.4 3.2 1.8-2 3.2-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z"
        fill={filled ? "#e5484d" : "white"}
        stroke={filled ? "#e5484d" : "white"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function DetachedIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M4 22 32 4l28 18" />
      <path d="M10 18v26h44V18" />
      <rect x="16" y="28" width="9" height="7" />
      <rect x="29" y="28" width="9" height="7" />
      <path d="M44 44V30h6v14" />
      <path d="M2 44h60" />
    </svg>
  );
}

export function HolidayIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M32 3 8 44h48L32 3Z" />
      <path d="M32 14 16 44M32 14l16 30" />
      <path d="M26 44V32h12v12" />
      <path d="M2 44h60" />
    </svg>
  );
}

export function CabinIcon({ className }: P) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M8 18h48" />
      <path d="M12 18v26h40V18" />
      <path d="M20 10h4v8M14 10h36" />
      <rect x="18" y="26" width="10" height="8" />
      <path d="M36 44V26h10v18" />
      <path d="M2 44h60" />
    </svg>
  );
}

export function ChatIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="white" aria-hidden>
      <path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function SortIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" />
    </svg>
  );
}

export function SocialIcon({ name, className }: P & { name: "instagram" | "x" | "youtube" | "linkedin" }) {
  const paths = {
    instagram: <><rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="#071438" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" fill="none" stroke="#071438" strokeWidth="1.8" /><circle cx="15.6" cy="8.4" r=".9" fill="#071438" /></>,
    x: <path d="M7 6.5h3l7 11h-3l-7-11Zm9.6 0L7.6 17.5" stroke="#071438" strokeWidth="1.6" fill="none" />,
    youtube: <><rect x="5.5" y="7.5" width="13" height="9" rx="2.5" fill="#071438" /><path d="m10.8 10 3.4 2-3.4 2v-4Z" fill="white" /></>,
    linkedin: <><rect x="7" y="10" width="2" height="7" fill="#071438" /><circle cx="8" cy="7.8" r="1.2" fill="#071438" /><path d="M11 17v-7h2v1c.5-.8 1.3-1.2 2.3-1.2 1.6 0 2.7 1 2.7 3V17h-2v-3.8c0-1-.5-1.6-1.4-1.6s-1.6.6-1.6 1.7V17h-2Z" fill="#071438" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="12" fill="white" />
      {paths[name]}
    </svg>
  );
}

export function ArrowCircle({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#3b4fe0] ${className}`}>
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </span>
  );
}


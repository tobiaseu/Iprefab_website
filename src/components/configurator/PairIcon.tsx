const s = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const paths: Record<string, React.ReactNode> = {
  sauna: (<><path d="M8 40h32M10 40V30h28v10M14 30v-6h20v6" /><path d="M18 18c-2-3 2-5 0-8M24 18c-2-3 2-5 0-8M30 18c-2-3 2-5 0-8" /></>),
  study: (<><path d="M6 30h36M10 30v12M38 30v12" /><rect x="16" y="14" width="16" height="12" /><path d="M24 26v4" /></>),
  open: (<><rect x="6" y="10" width="36" height="30" /><path d="M10 32h12M12 32v-6h8v6M28 32h10" /></>),
  closed: (<><rect x="6" y="10" width="36" height="30" /><path d="M24 10v30M10 32h10M28 32h10" /></>),
  one: (<><path d="M6 24 24 12l18 12" /><rect x="10" y="24" width="28" height="16" /></>),
  two: (<><path d="M8 18 24 6l16 12" /><rect x="12" y="18" width="24" height="22" /><path d="M12 29h24" /></>),
  wood: (<><rect x="8" y="8" width="32" height="32" /><path d="M16 8v32M24 8v32M32 8v32" /></>),
  plaster: (<><rect x="8" y="8" width="32" height="32" /><path d="M14 18h2M28 24h2M20 32h2M32 14h1" /></>),
};

export default function PairIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 48 48" className="size-10" aria-hidden="true" {...s}>
      {paths[name]}
    </svg>
  );
}

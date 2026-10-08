// Infinite horizontal scroll: children are rendered twice and the track slides by half its width.
export default function Marquee({
  children,
  duration = 60,
  className = "",
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] ${className}`}>
      <div className="marquee-track flex w-max" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden inert>{children}</div>
      </div>
    </div>
  );
}

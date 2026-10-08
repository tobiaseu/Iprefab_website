import { forwardRef, type CSSProperties } from "react";
import type { Config } from "./model";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const tr = (props = "transform, opacity, fill") => ({ transition: props.split(", ").map((p) => `${p} 700ms ${EASE}`).join(", ") });
const box = (origin: string): CSSProperties => ({ transformBox: "fill-box", transformOrigin: origin });

const COLORS = {
  sky: "#EFEDE8",
  ground: "#5E6B5A",
  navy: "#071438",
  glass: "#C9D1EC",
  wood: "#9A6B47",
  woodLine: "#7E5636",
  plaster: "#F4F2EE",
  roof: "#2A3350",
};

const SUN: Record<Config["orientation"], { x: number; y: number; o: number; shadow: number }> = {
  S: { x: 320, y: 70, o: 1, shadow: 0 },
  E: { x: 90, y: 140, o: 0.95, shadow: 70 },
  W: { x: 550, y: 140, o: 0.95, shadow: -70 },
  N: { x: 560, y: 60, o: 0.35, shadow: -30 },
};

// House body spans x 180..460. Ground floor y 310..400, upper floor y 220..310.
const X0 = 180;
const X1 = 460;

type Props = { config: Config; title: string };

const HouseDrawing = forwardRef<SVGSVGElement, Props>(function HouseDrawing({ config: c, title }, ref) {
  const sun = SUN[c.orientation];
  const two = c.floors === 2;
  const wood = c.facade === "wood";
  const scale = 0.82 + Math.min(1, Math.max(0, (c.plotSize - 400) / 2600)) * 0.26;
  const facadeFill = wood ? COLORS.wood : COLORS.plaster;
  const win = c.windows === "large" ? 1 : 0.6;
  const trees = Math.round(1 + Math.min(3, c.plotSize / 900));

  const windowRect = (x: number, y: number, w: number, extraScaleX = 1) => (
    <rect
      x={x}
      y={y}
      width={w}
      height={64}
      fill={COLORS.glass}
      stroke={COLORS.navy}
      strokeWidth={3}
      style={{ ...tr(), ...box("50% 100%"), transform: `scale(${extraScaleX}, ${win})` }}
    />
  );

  const boards = (y: number) => (
    <g style={{ ...tr(), opacity: wood ? 0.55 : 0 }} stroke={COLORS.woodLine} strokeWidth={1.5}>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={X0 + 20 * (i + 1)} x2={X0 + 20 * (i + 1)} y1={y} y2={y + 90} />
      ))}
    </g>
  );

  return (
    <svg ref={ref} viewBox="0 0 640 480" width={640} height={480} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title} className="h-auto w-full">
      <rect width="640" height="480" fill={COLORS.sky} />

      <g style={{ ...tr(), transform: `translate(${sun.x}px, ${sun.y}px)`, opacity: sun.o }}>
        <circle r="34" fill="#E8B04B" />
        <circle r="52" fill="#E8B04B" opacity="0.18" />
      </g>

      <rect y="400" width="640" height="80" fill={COLORS.ground} />
      <ellipse cx={320} cy={404} rx={170} ry={8} fill="#000" opacity="0.12" style={{ ...tr(), transform: `translateX(${sun.shadow}px)` }} />

      {[70, 590, 30, 620].map((x, i) => (
        <g key={x} style={{ ...tr(), opacity: i < trees ? 1 : 0 }}>
          <rect x={x - 3} y={360} width={6} height={40} fill="#3F4A3C" />
          <path d={`M${x} ${300 - (i % 2) * 20} L${x + 24} 370 L${x - 24} 370 Z`} fill="#4E5C4B" />
        </g>
      ))}

      <g style={{ ...tr(), ...box("50% 100%"), transform: `scale(${scale})` }}>
        {/* sauna chimney sits behind the roof */}
        <g style={{ ...tr(), transform: `translateY(${(two ? 0 : 90) + (c.extra === "sauna" ? 0 : 60)}px)`, opacity: c.extra === "sauna" ? 1 : 0 }}>
          <rect x={X1 - 78} y={128} width={20} height={92} fill="#3B3F4A" />
          <rect x={X1 - 82} y={124} width={28} height={8} fill={COLORS.navy} />
        </g>

        {/* upper floor */}
        <g style={{ ...tr(), ...box("50% 100%"), transform: `scaleY(${two ? 1 : 0})`, opacity: two ? 1 : 0 }}>
          <rect x={X0} y={220} width={X1 - X0} height={90} fill={facadeFill} stroke={COLORS.navy} strokeWidth={3} style={tr()} />
          {boards(220)}
          {windowRect(212, 236, 56)}
          {windowRect(372, 236, 56)}
        </g>

        {/* roof */}
        <g style={{ ...tr(), transform: `translateY(${two ? 0 : 90}px)` }} fill={COLORS.roof}>
          <path d={`M${X0 - 18} 222 L320 140 L${X1 + 18} 222 Z`} style={{ ...tr(), opacity: c.roof === "gable" ? 1 : 0 }} />
          <path d={`M${X0 - 18} 222 L${X0 - 18} 170 L${X1 + 18} 204 L${X1 + 18} 222 Z`} style={{ ...tr(), opacity: c.roof === "shed" ? 1 : 0 }} />
          <rect x={X0 - 12} y={206} width={X1 - X0 + 24} height={16} style={{ ...tr(), opacity: c.roof === "flat" ? 1 : 0 }} />
        </g>

        {/* ground floor */}
        <rect x={X0} y={310} width={X1 - X0} height={90} fill={facadeFill} stroke={COLORS.navy} strokeWidth={3} style={tr()} />
        {boards(310)}
        <g style={{ ...tr(), ...box("0% 100%"), transform: `scaleX(${c.kitchen === "open" ? 1 : 0.62})` }}>
          {windowRect(198, 324, 96)}
        </g>
        <rect x={306} y={332} width={34} height={68} fill={COLORS.navy} />
        {windowRect(372, 324, 60)}
      </g>
    </svg>
  );
});

export default HouseDrawing;

const ORBS = [
  [8, 12, 140, 0.18, 38, 60, -40], [22, 70, 60, 0.3, 44, -50, -70], [35, 30, 220, 0.1, 52, 70, 50],
  [48, 82, 90, 0.2, 36, 40, -60], [60, 18, 40, 0.4, 30, -30, 50], [72, 55, 180, 0.12, 48, -60, -40],
  [85, 25, 70, 0.25, 40, 50, 60], [92, 78, 120, 0.15, 46, -40, -50], [15, 45, 30, 0.45, 28, 30, 40],
  [55, 50, 260, 0.07, 60, 50, -30], [78, 92, 50, 0.3, 34, -50, -60], [30, 95, 160, 0.1, 50, 60, -40],
  [65, 5, 100, 0.18, 42, -40, 70], [5, 88, 80, 0.22, 38, 50, -50], [42, 8, 24, 0.5, 26, 20, 40],
];

export default function AmbientBackground() {
  return (
    <div aria-hidden className="ambient">
      <div className="glow" style={{ left: "-10%", top: "-15%", width: "60vw", height: "60vw", background: "rgb(70 110 230 / 0.35)" }} />
      <div className="glow" style={{ right: "-15%", top: "30%", width: "55vw", height: "55vw", background: "rgb(120 150 255 / 0.22)", animationDelay: "-7s" }} />
      <div className="glow" style={{ left: "20%", bottom: "-25%", width: "50vw", height: "50vw", background: "rgb(60 90 210 / 0.3)", animationDelay: "-3s" }} />
      {ORBS.map(([l, t, s, o, d, x, y], i) => (
        <span key={i} className="orb" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, opacity: o, ["--d" as string]: `${d}s`, ["--x" as string]: `${x}px`, ["--y" as string]: `${y}px`, animationDelay: `-${i * 3}s` }} />
      ))}
    </div>
  );
}

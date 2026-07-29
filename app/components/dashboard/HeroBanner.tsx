import { Snowflake, Calendar } from "lucide-react";

const SNOWFLAKES = [
  { left: "4%", size: 10, duration: 9, delay: 0 },
  { left: "12%", size: 14, duration: 11, delay: 1.5 },
  { left: "20%", size: 8, duration: 8, delay: 3 },
  { left: "28%", size: 16, duration: 13, delay: 0.5 },
  { left: "36%", size: 10, duration: 10, delay: 2.5 },
  { left: "44%", size: 12, duration: 12, delay: 4 },
  { left: "52%", size: 8, duration: 9, delay: 1 },
  { left: "60%", size: 14, duration: 11, delay: 3.5 },
  { left: "68%", size: 10, duration: 8, delay: 0.8 },
  { left: "76%", size: 16, duration: 13, delay: 2 },
  { left: "84%", size: 8, duration: 10, delay: 4.5 },
  { left: "92%", size: 12, duration: 9, delay: 1.8 },
  { left: "8%", size: 12, duration: 14, delay: 5 },
  { left: "58%", size: 10, duration: 10.5, delay: 3.2 },
  { left: "96%", size: 14, duration: 12.5, delay: 0.2 },
];

export function HeroBanner({ title, dateLabel }: { title: string; dateLabel: string }) {
  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl p-5 text-white sm:p-8"
      style={{ background: "linear-gradient(135deg, #0f3d2e, #163f2e)" }}
    >
      <Snowflake
        className="pointer-events-none absolute -right-4 -top-4 opacity-10 sm:-right-6 sm:-top-6"
        size={140}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {SNOWFLAKES.map((flake, i) => (
          <span
            key={i}
            className="snowflake absolute top-[-20px] text-white/70"
            style={{
              left: flake.left,
              fontSize: flake.size,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          >
            ❄
          </span>
        ))}
      </div>

      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10%) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(340px) translateX(20px) rotate(200deg);
            opacity: 0;
          }
        }
        .snowflake {
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      <div className="relative">
        <p className="mb-2 text-[10px] font-medium tracking-[0.2em] sm:mb-3 sm:text-xs" style={{ color: "#c9a227" }}>
          — SAVINGS SEASON
        </p>
        <h1 className="mb-3 text-3xl font-semibold leading-tight sm:mb-4 sm:text-5xl sm:leading-none">
          {title}
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm">
          <Calendar size={14} aria-hidden="true" />
          {dateLabel}
        </span>
      </div>
    </div>
  );
}
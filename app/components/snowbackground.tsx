const SNOWFLAKES = [
  { left: "2%", size: 10, duration: 16, delay: 0 },
  { left: "10%", size: 14, duration: 20, delay: 3 },
  { left: "18%", size: 8, duration: 14, delay: 6 },
  { left: "26%", size: 16, duration: 22, delay: 1 },
  { left: "34%", size: 10, duration: 18, delay: 5 },
  { left: "42%", size: 12, duration: 20, delay: 8 },
  { left: "50%", size: 8, duration: 15, delay: 2 },
  { left: "58%", size: 14, duration: 19, delay: 7 },
  { left: "66%", size: 10, duration: 16, delay: 1.5 },
  { left: "74%", size: 16, duration: 23, delay: 4 },
  { left: "82%", size: 8, duration: 17, delay: 9 },
  { left: "90%", size: 12, duration: 18, delay: 3.5 },
  { left: "96%", size: 10, duration: 21, delay: 6.5 },
];

export function SnowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {SNOWFLAKES.map((flake, i) => (
        <span
          key={i}
          className="page-snowflake absolute top-[-20px] opacity-[0.15]"
          style={{
            left: flake.left,
            fontSize: flake.size,
            color: "#0f3d2e",
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </span>
      ))}
      <style>{`
        @keyframes page-snowfall {
          0% { transform: translateY(-5%) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(30px) rotate(200deg); opacity: 0; }
        }
        .page-snowflake {
          animation-name: page-snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
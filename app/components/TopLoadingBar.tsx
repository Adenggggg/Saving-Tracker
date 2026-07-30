import { useNavigation } from "react-router";

export function TopLoadingBar() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  if (!isLoading) return null;

  return (
    <div className="fixed left-0 top-0 z-[100] h-1 w-full overflow-hidden bg-transparent">
      <div className="top-loading-bar-fill h-full" style={{ background: "#c9a227" }} />
      <style>{`
        @keyframes top-loading-slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .top-loading-bar-fill {
          width: 40%;
          animation: top-loading-slide 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
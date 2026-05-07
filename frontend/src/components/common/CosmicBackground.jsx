import React, { useMemo } from "react";

const CosmicBackground = ({ variant = "cosmic" }) => {
  const isSolid = variant === "solid";
  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.2 ? "3px" : Math.random() < 0.5 ? "2px" : "1px",
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 4 + 3}s`,
    }));
  }, []);

  const auroras = useMemo(() => {
    return [
      {
        id: 1,
        color: "bg-emerald-500",
        top: "-10%",
        left: "10%",
        delay: "0s",
        duration: "15s",
      },
      {
        id: 2,
        color: "bg-blue-500",
        top: "-15%",
        left: "40%",
        delay: "5s",
        duration: "18s",
      },
      {
        id: 3,
        color: "bg-purple-500",
        top: "-10%",
        left: "70%",
        delay: "10s",
        duration: "20s",
      },
      {
        id: 4,
        color: "bg-teal-400",
        top: "-20%",
        left: "25%",
        delay: "2s",
        duration: "22s",
      },
    ];
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
      {!isSolid && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#05071a] to-[#0a0e2a]"></div>
          {auroras.map((aurora) => (
            <div
              key={aurora.id}
              className={`absolute rounded-full blur-[120px] opacity-0 animate-aurora ${aurora.color}`}
              style={{
                top: aurora.top,
                left: aurora.left,
                width: "60%",
                height: "40%",
                animationDelay: aurora.delay,
                animationDuration: aurora.duration,
              }}
            />
          ))}
        </>
      )}

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-0 animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow:
              star.size === "3px"
                ? "0 0 6px 1px rgba(255, 255, 255, 0.6)"
                : "none",
          }}
        />
      ))}
    </div>
  );
};

export default CosmicBackground;

import { useEffect, useState } from "react";

export function GeneratingOverlay({ open, prompt }) {
  if (!open) return null;

  const loadingTexts = [
    `Analyzing ${prompt || ""}…`,
    "Planning UI structure…",
    "Creating components…",
    "Creating tables…",
    "Thinking…",
    "Fixing details…",
  ];
  
  const [textIndex, setTextIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % loadingTexts.length);
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  
    let lastIndex = 0;
  
    const interval = setInterval(() => {
      setTextIndex((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * loadingTexts.length);
        } while (next === prev);
  
        return next;
      });
    }, 1400);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(0,0,0,0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          padding: 24,
          color: "rgba(0, 0, 0, 0.92)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            width: 360,
            maxWidth: "90vw",
            backgroundColor: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            padding: 18,
          }}
        >
          <p
            className="loading-text"
            style={{
              fontSize: "14px",
              color: "#a1a1a1",
            }}
          >
            {loadingTexts[textIndex]}
          </p>
          <div className="loader"></div>
        </div>
      </div>
      <style>{`

        .loader {
          width: 15px;
          flex-shrink: 0;
          aspect-ratio: 1;
          border-radius: 50%;
          margin-right: 15px;
          animation: l5 1s infinite linear alternate;
        }

        .loading-text {
          opacity: 0.85;
          animation: fade 1.5s ease-in-out infinite;
        }

        @keyframes fade {
          0% { opacity: 0.4 }
          50% { opacity: 1 }
          100% { opacity: 0.4 }
        }

        @keyframes l5 {
          0% {
            background: #62c0ff;
            box-shadow: 20px 0 #62c0ff, -20px 0 rgba(98, 192, 255, 0.25);
          }
          33% {
            background: rgba(98, 192, 255, 0.25);
            box-shadow: 20px 0 #62c0ff, -20px 0 rgba(98, 192, 255, 0.25);
          }
          66% {
            background: rgba(98, 192, 255, 0.25);
            box-shadow: 20px 0 rgba(98, 192, 255, 0.25), -20px 0 #62c0ff;
          }
          100% {
            background: #62c0ff;
            box-shadow: 20px 0 rgba(98, 192, 255, 0.25), -20px 0 #62c0ff;
          }
        }
      `}</style>
    </div>
  );
}

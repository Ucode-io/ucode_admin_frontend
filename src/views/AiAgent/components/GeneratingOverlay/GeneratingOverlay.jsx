export function GeneratingOverlay({ open, text = "Generating...", withContent = true }) {
  if (!open) return null;

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

        {
          withContent && <div
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
              width: 360,
              maxWidth: "90vw",
              borderRadius: 16,
              // background: "rgba(255, 255, 255, 0.98)",
              border: "1px solid rgba(255,255,255,0.12)",
              // boxShadow: "0 10px 30px rgba(171, 171, 171, 0.35)",
              padding: 18,
            }}
          >
            {/* верхняя бегущая линия */}
            {/* <div
              style={{
                height: 4,
                borderRadius: 999,
                overflow: "hidden",
                background: "rgba(79, 79, 79, 0.1)",
                marginBottom: 14,
                position: "relative",
              }}
            >
              <div className="gen-bar" />
            </div> */}
  
            {/* спиннер */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="gen-spinner" />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 14, color: "rgba(42, 42, 42, 0.6)", fontWeight: 600 }}>
                  {text}
                </div>
                <div style={{ fontSize: 12, color: "rgba(42, 42, 42, 0.6)" }}>
                  Please wait… don&apos;t close the tab
                </div>
              </div>
            </div>
  
            {/* точки */}
            {/* <div style={{ marginTop: 12, fontSize: 12, color: "rgba(81, 81, 81, 0.55)" }}>
              Working<span className="gen-dots">...</span>
            </div> */}
          </div>
        </div>
        }

      <style>{`
        .gen-spinner{
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2px solid rgba(95, 95, 95, 0.25);
          border-top-color: rgba(94, 94, 94, 0.95);
          animation: genSpin 0.9s linear infinite;
          flex: 0 0 auto;
        }
        @keyframes genSpin { to { transform: rotate(360deg); } }

        .gen-bar{
          position:absolute;
          inset:0;
          width:40%;
          background: rgb(255, 255, 255);
          border-radius: 999px;
          transform: translateX(-60%);
          animation: genBar 1.2s linear infinite;
        }
        @keyframes genBar{
          0% { transform: translateX(-60%); opacity: .35; }
          50% { transform: translateX(160%); opacity: 1; }
          100% { transform: translateX(260%); opacity: .35; }
        }

        .gen-dots{
          display:inline-block;
          width: 18px;
          text-align:left;
          animation: genDots 1.2s steps(3,end) infinite;
        }
        @keyframes genDots{
          0% { content:""; }
          33% { }
          66% { }
          100% { }
        }
      `}</style>
    </div>
  );
}

import React from "react";
import { FONT, REAL } from "../fk/theme";

/**
 * A phone on the bedside at night (HTML, 1:1 frame pixels). Mode "call": the neighbour calling
 * at 2 a.m. Mode "alert": a lock-screen fire alert notification. Width 380 x 780.
 */
export const Phone: React.FC<{ mode: "call" | "alert"; t: number; ring?: number; note?: number; time?: string }> = ({
  mode,
  t,
  ring = 1,
  note = 1,
  time = "2:04",
}) => {
  const buzz = ring > 0 && mode === "call" ? Math.sin(t * 2.6) * 3 * (Math.sin(t * 0.21) > 0 ? 1 : 0) * ring : 0;
  return (
    <div style={{ position: "relative", width: 380, height: 780, translate: `${buzz}px 0`, rotate: `${buzz * 0.2}deg` }}>
      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 58,
          background: "linear-gradient(135deg, #3a3d42 0%, #15171a 40%, #0b0c0e 100%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(255,255,255,0.08)",
        }}
      />
      {/* screen */}
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: 48,
          overflow: "hidden",
          background: mode === "call" ? "linear-gradient(180deg, #1b2230 0%, #0b0d12 100%)" : "linear-gradient(180deg, #141820 0%, #07080b 100%)",
          fontFamily: FONT.sans,
          color: "#fff",
        }}
      >
        <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 30, marginLeft: -55, borderRadius: 20, background: "#000" }} />
        {mode === "call" ? (
          <>
            <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontSize: 20, opacity: 0.6, letterSpacing: "0.04em" }}>incoming call</div>
            <div style={{ position: "absolute", top: 156, width: "100%", textAlign: "center", fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em" }}>Padosi</div>
            <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", fontSize: 22, opacity: 0.55 }}>Mobile · {time} AM</div>
            {/* avatar with ring pulse */}
            <div style={{ position: "absolute", top: 300, left: "50%", marginLeft: -70, width: 140, height: 140 }}>
              {[0, 1].map((i) => {
                const ph = ((t * 0.03 + i * 0.5) % 1) * ring;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      inset: -ph * 60,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.5)",
                      opacity: (1 - ph) * ring,
                    }}
                  />
                );
              })}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3a4152", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 600 }}>P</div>
            </div>
            <div style={{ position: "absolute", bottom: 90, left: 52, width: 88, height: 88, borderRadius: "50%", background: "#E5383B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhoneIcon rot={135} />
            </div>
            <div style={{ position: "absolute", bottom: 90, right: 52, width: 88, height: 88, borderRadius: "50%", background: "#30C85A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhoneIcon rot={0} />
            </div>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", top: 100, width: "100%", textAlign: "center", fontSize: 22, opacity: 0.7 }}>Thursday</div>
            <div style={{ position: "absolute", top: 126, width: "100%", textAlign: "center", fontSize: 112, fontWeight: 500, letterSpacing: "-0.04em" }}>{time}</div>
            <div
              style={{
                position: "absolute",
                top: 300,
                left: 18,
                right: 18,
                padding: "18px 20px",
                borderRadius: 26,
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.12)",
                opacity: note,
                translate: `0 ${(1 - note) * -40}px`,
                scale: `${0.92 + 0.08 * note}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, opacity: 0.75, letterSpacing: "0.02em" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: REAL.lampRed }} />
                </div>
                PROTECTOR · now
              </div>
              <div style={{ marginTop: 10, fontSize: 25, fontWeight: 700 }}>Fire alert: aapki dukaan</div>
              <div style={{ marginTop: 4, fontSize: 20, opacity: 0.75, lineHeight: 1.3 }}>Fire detected · tap to view</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PhoneIcon: React.FC<{ rot: number }> = ({ rot }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" style={{ rotate: `${rot}deg` }}>
    <path
      d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"
      fill="#fff"
    />
  </svg>
);

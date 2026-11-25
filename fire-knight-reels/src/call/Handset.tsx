import React from "react";
import { C, FONT, REAL } from "../fk/theme";

/**
 * A phone at night (HTML, 1:1 frame pixels, 380 x 780). Screens:
 *  - "incoming": someone is calling you (name, sub line, ring pulse, decline / accept)
 *  - "outgoing": you are calling someone (name, status line that changes, end-call button)
 *  - "lock": a lock screen with a stack of notifications and an optional silent-mode pill
 *  - "app": an illustrative remote screen for the unit, with an Activate button
 * Everything shown is illustrative; no real app screen is copied.
 */
export type Note = { app: string; title: string; body: string; danger?: boolean; p?: number };

export const Handset: React.FC<{
  screen: "incoming" | "outgoing" | "lock" | "app";
  t: number;
  name?: string;
  sub?: string;
  status?: string;
  time?: string;
  ring?: number;
  notes?: Note[];
  silent?: boolean;
  dim?: number; // 0 = lit, 1 = screen asleep
  press?: number; // app: Activate button press 0..1
  done?: number; // app: confirmation 0..1
}> = ({ screen, t, name = "", sub = "", status = "", time = "2:01", ring = 1, notes = [], silent = false, dim = 0, press = 0, done = 0 }) => {
  const buzz = ring > 0 && screen === "incoming" ? Math.sin(t * 2.6) * 3 * (Math.sin(t * 0.21) > 0 ? 1 : 0) * ring : 0;
  const bg =
    screen === "incoming" || screen === "outgoing"
      ? "linear-gradient(180deg, #1b2230 0%, #0b0d12 100%)"
      : screen === "app"
        ? "linear-gradient(180deg, #121316 0%, #060607 100%)"
        : "linear-gradient(180deg, #141820 0%, #07080b 100%)";
  return (
    <div style={{ position: "relative", width: 380, height: 780, translate: `${buzz}px 0`, rotate: `${buzz * 0.2}deg` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 58,
          background: "linear-gradient(135deg, #3a3d42 0%, #15171a 40%, #0b0c0e 100%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(255,255,255,0.08)",
        }}
      />
      <div style={{ position: "absolute", inset: 12, borderRadius: 48, overflow: "hidden", background: bg, fontFamily: FONT.sans, color: "#fff" }}>
        <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 30, marginLeft: -55, borderRadius: 20, background: "#000", zIndex: 3 }} />
        {silent && (
          <div style={{ position: "absolute", top: 60, left: "50%", translate: "-50% 0", display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.12)", fontSize: 17, fontWeight: 600, whiteSpace: "nowrap", zIndex: 2 }}>
            <svg width={18} height={18} viewBox="0 0 24 24">
              <path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4L6 17zM10 20h4" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4l16 16" stroke="#FF5A4E" strokeWidth={2.4} strokeLinecap="round" />
            </svg>
            Silent
          </div>
        )}

        {(screen === "incoming" || screen === "outgoing") && (
          <>
            <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontSize: 20, opacity: 0.6, letterSpacing: "0.04em" }}>{screen === "incoming" ? "incoming call" : status}</div>
            <div style={{ position: "absolute", top: 156, width: "100%", textAlign: "center", fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}>{name}</div>
            <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", fontSize: 22, opacity: 0.55 }}>{sub}</div>
            <div style={{ position: "absolute", top: 310, left: "50%", marginLeft: -70, width: 140, height: 140 }}>
              {[0, 1].map((i) => {
                const ph = ((t * 0.03 + i * 0.5) % 1) * ring;
                return <div key={i} style={{ position: "absolute", inset: -ph * 60, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)", opacity: (1 - ph) * ring }} />;
              })}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3a4152", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 600, color: "#c3cbdb" }}>
                {name.slice(0, 1)}
              </div>
            </div>
            {screen === "incoming" ? (
              <>
                <Round left={52} color="#E5383B" rot={135} />
                <Round right={52} color="#30C85A" rot={0} />
              </>
            ) : (
              <Round left={134} color="#E5383B" rot={135} />
            )}
          </>
        )}

        {screen === "lock" && (
          <>
            <div style={{ position: "absolute", top: 104, width: "100%", textAlign: "center", fontSize: 22, opacity: 0.7 }}>Wednesday</div>
            <div style={{ position: "absolute", top: 130, width: "100%", textAlign: "center", fontSize: 108, fontWeight: 500, letterSpacing: "-0.04em" }}>{time}</div>
            <div style={{ position: "absolute", top: 296, left: 18, right: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              {notes.map((n, i) => {
                const p = n.p ?? 1;
                return (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      borderRadius: 26,
                      background: n.danger ? "rgba(227,40,28,0.16)" : "rgba(255,255,255,0.13)",
                      border: n.danger ? "1.5px solid rgba(227,40,28,0.85)" : "1px solid rgba(255,255,255,0.12)",
                      boxShadow: n.danger ? "0 0 40px rgba(227,40,28,0.35)" : undefined,
                      opacity: p,
                      translate: `0 ${(1 - p) * -30}px`,
                      scale: `${0.92 + 0.08 * p}`,
                      display: p <= 0 ? "none" : undefined,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 17, opacity: 0.75, letterSpacing: "0.02em" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: n.danger ? "#0b0b0b" : "#2a8f4e", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: n.danger ? REAL.lampRed : "#fff" }} />
                      </div>
                      {n.app} · now
                    </div>
                    <div style={{ marginTop: 8, fontSize: 25, fontWeight: 700 }}>{n.title}</div>
                    <div style={{ marginTop: 4, fontSize: 20, opacity: 0.75, lineHeight: 1.3 }}>{n.body}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {screen === "app" && (
          <>
            <div style={{ position: "absolute", top: 70, left: 26, right: 26, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Server room</div>
              <div style={{ fontSize: 16, opacity: 0.55 }}>{time} AM</div>
            </div>
            <div style={{ position: "absolute", top: 118, left: 18, right: 18, borderRadius: 24, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", padding: 18 }}>
              <div style={{ fontSize: 17, opacity: 0.6, letterSpacing: "0.04em" }}>UNIT 01 · WALL</div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 700 }}>The Comodo</div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 600, color: "#FF8A7E" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: REAL.lampRed, boxShadow: "0 0 12px rgba(227,40,28,0.9)" }} />
                Fire detected
              </div>
              <div style={{ marginTop: 14, height: 150, borderRadius: 14, background: "linear-gradient(160deg, #23262b 0%, #0e0f11 100%)", position: "relative", overflow: "hidden" }}>
                {/* the still the unit captured, shown as a small frame */}
                <div style={{ position: "absolute", left: 128, top: 34, width: 70, height: 92, borderRadius: 4, background: "linear-gradient(135deg,#cfd3d6,#8f959b)" }} />
                <div style={{ position: "absolute", left: 148, top: 98, width: 30, height: 30, borderRadius: "50% 50% 46% 46%", background: "radial-gradient(circle at 50% 70%, #FFF4DC 0%, #FFB33A 35%, #FF6A1A 65%, rgba(226,54,26,0) 100%)" }} />
                <div style={{ position: "absolute", left: 10, bottom: 8, fontSize: 14, opacity: 0.7 }}>Photo · before activation</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 150, textAlign: "center", fontSize: 17, opacity: 0.55 }}>Remote control</div>
            <div
              style={{
                position: "absolute",
                left: 30,
                right: 30,
                bottom: 66,
                height: 74,
                borderRadius: 37,
                background: done > 0.5 ? "#1F9D55" : C.gold,
                color: done > 0.5 ? "#fff" : "#141414",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: "0.02em",
                scale: `${1 - 0.05 * Math.sin(Math.min(1, press) * Math.PI)}`,
                boxShadow: `0 0 ${30 * (1 - done)}px rgba(240,178,66,0.45)`,
              }}
            >
              {done > 0.5 ? "Activated" : "Activate unit"}
            </div>
            {press > 0 && press < 1 && (
              <div style={{ position: "absolute", left: "50%", bottom: 103, width: 0, height: 0 }}>
                <div style={{ position: "absolute", left: -40 - press * 60, top: -40 - press * 60, width: 80 + press * 120, height: 80 + press * 120, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)", opacity: 1 - press }} />
              </div>
            )}
          </>
        )}
        {dim > 0 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim * 0.86 }} />}
      </div>
    </div>
  );
};

const Round: React.FC<{ left?: number; right?: number; color: string; rot: number }> = ({ left, right, color, rot }) => (
  <div style={{ position: "absolute", bottom: 90, left, right, width: 88, height: 88, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={40} height={40} viewBox="0 0 24 24" style={{ rotate: `${rot}deg` }}>
      <path
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"
        fill="#fff"
      />
    </svg>
  </div>
);

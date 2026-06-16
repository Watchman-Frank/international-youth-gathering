"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function WelcomeAnimation() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (typeof window === "undefined") return;

    const alreadyShown = sessionStorage.getItem("iyg_welcomed");
    if (alreadyShown) return;

    sessionStorage.setItem("iyg_welcomed", "1");
    setVisible(true);

    // Start exit fade at 1.8s, fully unmount at 2.2s
    const exitTimer = setTimeout(() => setExiting(true), 1800);
    const unmountTimer = setTimeout(() => setVisible(false), 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [status, session]);

  if (!visible) return null;

  const firstName = session?.user?.name?.split(" ")[0] ?? "Friend";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, #0D6B30 0%, #083D1C 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        animation: exiting
          ? "iyg-fadeOut 0.4s ease forwards"
          : "iyg-fadeIn 0.3s ease forwards",
      }}
    >
      <style>{`
        @keyframes iyg-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes iyg-fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes iyg-scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes iyg-slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iyg-expand {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes iyg-particle {
          0%   { transform: translateY(0px) scale(1); opacity: 0.7; }
          50%  { transform: translateY(-14px) scale(1.2); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 0.7; }
        }
      `}</style>

      {/* Floating gold particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[
          { top: "20%", left: "12%", delay: "0s",    size: 6 },
          { top: "70%", left: "80%", delay: "0.4s",  size: 5 },
          { top: "35%", left: "88%", delay: "0.8s",  size: 4 },
          { top: "78%", left: "18%", delay: "0.2s",  size: 7 },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "#C8831A",
              animation: `iyg-particle 2s ${p.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <img
          src="/logo.png"
          alt="IYG"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
            animation: "iyg-scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        />

        {/* Welcome back */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C8831A",
            animation: "iyg-slideUp 0.5s 0.2s ease both",
            margin: 0,
          }}
        >
          Welcome back,
        </p>

        {/* First name */}
        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            margin: 0,
            animation: "iyg-slideUp 0.55s 0.32s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          {firstName}
        </h1>

        {/* Expanding gold line */}
        <div
          style={{
            width: 160,
            height: 2,
            background: "linear-gradient(90deg, transparent, #C8831A, transparent)",
            transformOrigin: "center",
            animation: "iyg-expand 0.6s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export function StatCounter({
  value,
  suffix = "",
  label,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplay(latest.toFixed(decimals));
      },
    });
    return () => controls.stop();
  }, [isInView, value, decimals]);

  return (
    <div>
      <div className="flex items-baseline gap-0.5 font-mono text-3xl font-semibold text-zinc-50 sm:text-4xl">
        <span ref={ref}>{display}</span>
        <span className="gradient-text">{suffix}</span>
      </div>
      <p className="mt-2 text-sm leading-snug text-zinc-400">{label}</p>
    </div>
  );
}

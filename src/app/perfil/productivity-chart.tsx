"use client";

import { useMemo, useRef, useState } from "react";

export type ProductivityPoint = {
  date: string; // YYYY-MM-DD
  day: number; // 1..31
  count: number;
  score: number; // 0..5
};

type ProductivityChartProps = {
  points: ProductivityPoint[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getScoreColor(score: number) {
  if (score <= 0) return "rgba(100,116,139,0.35)";
  if (score === 1) return "rgba(239,68,68,0.95)";
  if (score === 2) return "rgba(249,115,22,0.95)";
  if (score === 3) return "rgba(245,158,11,0.95)";
  if (score === 4) return "rgba(132,204,22,0.95)";
  return "rgba(16,185,129,0.95)";
}

export function ProductivityChart({ points }: ProductivityChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chart = useMemo(() => {
    const width = 340;
    const height = 180;
    const padX = 18;
    const padTop = 14;
    const padBottom = 24;

    const innerW = width - padX * 2;
    const innerH = height - padTop - padBottom;

    const n = Math.max(1, points.length);
    const stepX = n === 1 ? 0 : innerW / (n - 1);

    const yForScore = (score: number) => {
      const clamped = clamp(score, 1, 5);
      const t = (clamped - 1) / 4;
      return padTop + innerH * (1 - t);
    };

    const xForIndex = (i: number) => padX + i * stepX;

    const segments: string[] = [];
    let current = "";

    points.forEach((p, i) => {
      if (p.score <= 0) {
        if (current) {
          segments.push(current);
          current = "";
        }
        return;
      }

      const x = xForIndex(i);
      const y = yForScore(p.score);
      current = current ? `${current} L ${x} ${y}` : `M ${x} ${y}`;
    });

    if (current) segments.push(current);

    const areaPath = (() => {
      const firstIdx = points.findIndex((p) => p.score > 0);
      const lastIdx = (() => {
        for (let i = points.length - 1; i >= 0; i -= 1) {
          if (points[i].score > 0) return i;
        }
        return -1;
      })();

      if (firstIdx < 0 || lastIdx < 0) return null;

      let d = "";
      for (let i = firstIdx; i <= lastIdx; i += 1) {
        const p = points[i];
        if (p.score <= 0) continue;
        const x = xForIndex(i);
        const y = yForScore(p.score);
        d = d ? `${d} L ${x} ${y}` : `M ${x} ${y}`;
      }

      const xEnd = xForIndex(lastIdx);
      const xStart = xForIndex(firstIdx);
      const yBase = padTop + innerH;

      return `${d} L ${xEnd} ${yBase} L ${xStart} ${yBase} Z`;
    })();

    const gridYs = [5, 4, 3, 2, 1].map((s) => yForScore(s));

    return {
      width,
      height,
      padTop,
      padBottom,
      padX,
      innerW,
      innerH,
      stepX,
      segments,
      areaPath,
      gridYs,
      xForIndex,
      yForScore,
    };
  }, [points]);

  const handlePointer = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const ratio = rect.width === 0 ? 0 : x / rect.width;
    const idx = clamp(Math.round(ratio * (points.length - 1)), 0, points.length - 1);
    setActiveIndex(idx);
  };

  const active = activeIndex === null ? null : points[activeIndex];
  const activeX = activeIndex === null ? null : chart.xForIndex(activeIndex);
  const activeY = active && active.score > 0 ? chart.yForScore(active.score) : null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-[28px_1fr] gap-3 items-start">
        <div className="flex flex-col items-center justify-between pt-[14px] pb-[24px] h-[180px] text-xs select-none">
          <span className="opacity-80">😄</span>
          <span className="opacity-80">🙂</span>
          <span className="opacity-80">😐</span>
          <span className="opacity-80">😕</span>
          <span className="opacity-80">😡</span>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="w-full h-[180px] touch-none"
            onPointerLeave={() => setActiveIndex(null)}
            onPointerDown={(e) => handlePointer(e.clientX)}
            onPointerMove={(e) => handlePointer(e.clientX)}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (touch) handlePointer(touch.clientX);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (touch) handlePointer(touch.clientX);
            }}
          >
            <defs>
              <linearGradient id="daylioLine" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(16,185,129,0.95)" />
                <stop offset="45%" stopColor="rgba(245,158,11,0.95)" />
                <stop offset="100%" stopColor="rgba(239,68,68,0.95)" />
              </linearGradient>
              <linearGradient id="daylioFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(16,185,129,0.22)" />
                <stop offset="60%" stopColor="rgba(14,165,233,0.08)" />
                <stop offset="100%" stopColor="rgba(2,6,23,0)" />
              </linearGradient>
            </defs>

            {chart.gridYs.map((y, idx) => (
              <line
                key={idx}
                x1={chart.padX}
                x2={chart.padX + chart.innerW}
                y1={y}
                y2={y}
                stroke="rgba(148,163,184,0.18)"
                strokeDasharray="3 6"
              />
            ))}

            {chart.areaPath && (
              <path d={chart.areaPath} fill="url(#daylioFill)" stroke="none" />
            )}

            {chart.segments.map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="none"
                stroke="url(#daylioLine)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {points.map((p, i) => {
              if (p.score <= 0) return null;
              const x = chart.xForIndex(i);
              const y = chart.yForScore(p.score);
              const isActive = activeIndex === i;
              const fill = getScoreColor(p.score);

              return (
                <g key={p.date}>
                  <circle cx={x} cy={y} r={isActive ? 5.5 : 4} fill={fill} />
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 10 : 0}
                    fill="rgba(245,158,11,0.10)"
                  />
                </g>
              );
            })}

            {active && activeX !== null && activeY !== null && (
              <g>
                <line
                  x1={activeX}
                  x2={activeX}
                  y1={chart.padTop}
                  y2={chart.height - chart.padBottom}
                  stroke="rgba(245,158,11,0.25)"
                  strokeDasharray="4 6"
                />
              </g>
            )}

            {points.map((p, i) => {
              const show = p.day === 1 || p.day % 2 === 1;
              if (!show) return null;
              const x = chart.xForIndex(i);
              return (
                <text
                  key={`x-${p.date}`}
                  x={x}
                  y={chart.height - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="rgba(148,163,184,0.6)"
                >
                  {p.day}
                </text>
              );
            })}
          </svg>

          {active && (
            <div
              className="absolute top-2 left-2 right-2 flex justify-center pointer-events-none"
              style={{ opacity: activeIndex === null ? 0 : 1 }}
            >
              <div className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/80 backdrop-blur text-xs text-slate-200 font-heading tracking-widest uppercase shadow-[0_0_20px_rgba(0,0,0,0.45)]">
                <span className="text-slate-400">{active.date}</span>{" "}
                <span className="text-theme-light">•</span>{" "}
                <span className="text-slate-200">{active.count} quests</span>{" "}
                <span className="text-theme-light">•</span>{" "}
                <span className="text-slate-200">Nível {active.score}/5</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

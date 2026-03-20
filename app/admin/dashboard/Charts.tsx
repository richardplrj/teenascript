"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface CategoryData { category: string; count: number; }

const CATEGORY_COLORS: Record<string, string> = {
  Science:    "#3b82f6",
  Technology: "#10b981",
  Literature: "#a855f7",
  History:    "#f59e0b",
  Philosophy: "#64748b",
  Other:      "#78716c",
};

function useColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return {
    grid:   dark ? "#2a2926" : "#e7e5e4",
    tick:   dark ? "#78716c" : "#a8a29e",
    tooltip: dark ? "#1a1916" : "#ffffff",
    tooltipBorder: dark ? "#2a2926" : "#e7e5e4",
  };
}

export function CategoryChart({ data }: { data: CategoryData[] }) {
  const c = useColors();
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: c.tick }} allowDecimals={false} />
        <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: c.tick }} width={76} />
        <Tooltip
          contentStyle={{ background: c.tooltip, border: `1px solid ${c.tooltipBorder}`, borderRadius: 0, fontSize: 12, fontFamily: "var(--font-dm-sans)" }}
          cursor={{ fill: "rgba(196,93,62,0.06)" }}
        />
        <Bar dataKey="count" radius={[0, 2, 2, 0]} name="Articles">
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? "#78716c"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}


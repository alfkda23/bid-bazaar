import { useEffect, useMemo, useState } from "react";

export type CountdownLevel = "success" | "warning" | "danger";

export type CountdownState = {
  msLeft: number;
  level: CountdownLevel;
  done: boolean;
  label: string;
};

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const parts = [
    h > 0 ? String(h).padStart(2, "0") : null,
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].filter(Boolean) as string[];

  return parts.join(":");
}

export function useAuctionCountdown(endsAtIso: string): CountdownState {
  const endsAt = useMemo(() => new Date(endsAtIso).getTime(), [endsAtIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const msLeft = Math.max(0, endsAt - now);
  const done = msLeft <= 0;
  const minutesLeft = msLeft / 60_000;

  const level: CountdownLevel = minutesLeft <= 5 ? "danger" : minutesLeft <= 20 ? "warning" : "success";
  const label = done ? "انتهى" : formatCountdown(msLeft);

  return { msLeft, level, done, label };
}

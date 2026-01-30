import { cn } from "@/lib/utils";
import { formatEgp } from "@/data/mockAuctions";
import { ArrowUpRight } from "lucide-react";

export type BidRow = {
  id: string;
  trader: string;
  amountEgp: number;
  tsIso: string;
};

type Props = {
  rows: BidRow[];
  className?: string;
  highlightId?: string;
};

export default function BidHistoryTicker({ rows, className, highlightId }: Props) {
  return (
    <div className={cn("rounded-3xl border bg-card p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold">سجل العروض</div>
        <div className="text-xs text-muted-foreground">تحديث شبه لحظي</div>
      </div>

      <div className="mt-3 grid gap-2">
        {rows.slice(0, 8).map((r) => {
          const isHot = r.id === highlightId;
          return (
            <div
              key={r.id}
              className={cn(
                "flex items-center justify-between rounded-2xl border bg-background/60 px-3 py-2",
                isHot ? "animate-float-up" : "",
              )}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{r.trader}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.tsIso).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-extrabold">{formatEgp(r.amountEgp)}</div>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

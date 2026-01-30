import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { CountdownLevel, useAuctionCountdown } from "@/components/auction/useAuctionCountdown";

type Props = {
  endsAt: string;
  className?: string;
  size?: "sm" | "lg";
};

function levelToBadge(level: CountdownLevel) {
  if (level === "danger") return "danger" as const;
  if (level === "warning") return "warning" as const;
  return "success" as const;
}

export default function CountdownPill({ endsAt, className, size = "sm" }: Props) {
  const cd = useAuctionCountdown(endsAt);
  const badgeVariant = levelToBadge(cd.level);

  return (
    <Badge
      variant={badgeVariant}
      className={cn(
        "inline-flex items-center gap-2 rounded-full",
        size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs",
        cd.level === "danger" && !cd.done ? "animate-auction-pulse" : "",
        className,
      )}
    >
      <Clock className={cn(size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5")} />
      <span className="font-bold tracking-wide">{cd.label}</span>
    </Badge>
  );
}

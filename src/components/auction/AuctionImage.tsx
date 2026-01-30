import { Wheat, Fish, Package } from "lucide-react";
import { cn } from "@/lib/utils";

type AuctionImageProps = {
  category: string;
  className?: string;
};

function pickIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("سم")) return Fish;
  if (c.includes("زيت") || c.includes("زيوت")) return Package;
  return Wheat;
}

export default function AuctionImage({ category, className }: AuctionImageProps) {
  const Icon = pickIcon(category);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card shadow-soft",
        "before:absolute before:inset-0 before:bg-[radial-gradient(500px_220px_at_80%_10%,hsl(var(--brand)/0.25),transparent_60%)]",
        "after:absolute after:inset-0 after:bg-[radial-gradient(520px_260px_at_10%_90%,hsl(var(--success)/0.18),transparent_60%)]",
        className,
      )}
      aria-hidden
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="grid place-items-center rounded-2xl border bg-background/70 px-6 py-5 shadow-soft backdrop-blur">
          <Icon className="h-10 w-10 text-primary" />
          <div className="mt-2 text-xs font-semibold text-muted-foreground">{category}</div>
        </div>
      </div>
    </div>
  );
}

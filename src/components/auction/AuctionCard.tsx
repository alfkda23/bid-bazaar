import { Auction, formatCompact, formatEgp } from "@/data/mockAuctions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import CountdownPill from "@/components/auction/CountdownPill";
import AuctionImage from "@/components/auction/AuctionImage";
import { cn } from "@/lib/utils";
import { ArrowLeft, Users } from "lucide-react";

type Props = {
  auction: Auction;
  className?: string;
};

function typeLabel(type: Auction["type"]) {
  return type === "sell" ? "بيع" : "شراء";
}

function typeVariant(type: Auction["type"]) {
  return type === "sell" ? ("success" as const) : ("brand" as const);
}

export default function AuctionCard({ auction, className }: Props) {
  return (
    <Card className={cn("overflow-hidden rounded-3xl shadow-soft", className)}>
      <div className="grid grid-cols-[96px_1fr] gap-3 p-3">
        <div className="relative">
          <AuctionImage category={auction.category} className="h-24 w-24" />
          <div className="absolute right-2 top-2">
            <Badge variant={typeVariant(auction.type)} className="rounded-full">
              {typeLabel(auction.type)}
            </Badge>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-base font-extrabold">{auction.title}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{auction.region}</span>
                <span aria-hidden>•</span>
                <span>
                  {formatCompact(auction.quantity)} {auction.unit}
                </span>
              </div>
            </div>

            <CountdownPill endsAt={auction.endsAt} />
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">أعلى عرض حالي</div>
              <div className="truncate text-lg font-extrabold text-foreground">{formatEgp(auction.currentBidEgp)}</div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                <Users className="ml-1 h-3.5 w-3.5" />
                {formatCompact(auction.biddersCount)}
              </Badge>
              <Button asChild variant="bid" size="sm" className="rounded-full">
                <NavLink to={`/auction/${auction.id}`}>
                  مزايدة سريعة
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

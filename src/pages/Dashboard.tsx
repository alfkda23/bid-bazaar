import AppShell from "@/components/layout/AppShell";
import { auctions, formatCompact, formatEgp } from "@/data/mockAuctions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { BarChart3, Trophy, XCircle } from "lucide-react";

export default function Dashboard() {
  const active = auctions.slice(0, 2);
  const won = 3;
  const lost = 1;
  const totalBids = auctions.reduce((acc, a) => acc + a.bidsCount, 0);

  return (
    <AppShell>
      <main className="mx-auto grid max-w-md gap-4 px-4 pb-24 pt-5">
        <header>
          <p className="text-sm text-muted-foreground">ملخص سريع</p>
          <h1 className="font-display text-2xl font-extrabold">لوحة التحكم</h1>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <Card className="rounded-3xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">إجمالي العروض</div>
              <Badge variant="brand" className="rounded-full">
                <BarChart3 className="ml-1 h-4 w-4" />
                {formatCompact(totalBids)}
              </Badge>
            </div>
            <div className="mt-2 text-lg font-extrabold">معدل الفوز</div>
            <div className="text-sm text-muted-foreground">{formatCompact(Math.round((won / Math.max(1, won + lost)) * 100))}%</div>
          </Card>

          <Card className="rounded-3xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">النتائج</div>
              <div className="flex gap-1">
                <Badge variant="success" className="rounded-full">
                  <Trophy className="ml-1 h-4 w-4" />
                  {won}
                </Badge>
                <Badge variant="danger" className="rounded-full">
                  <XCircle className="ml-1 h-4 w-4" />
                  {lost}
                </Badge>
              </div>
            </div>
            <div className="mt-2 text-lg font-extrabold">نشاط اليوم</div>
            <div className="text-sm text-muted-foreground">مراقبة مزاداتك المفضلة</div>
          </Card>
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold">مزادات أشارك بها</h2>
            <Button asChild variant="link" className="h-auto p-0">
              <NavLink to="/">عرض الكل</NavLink>
            </Button>
          </div>

          {active.map((a) => (
            <Card key={a.id} className="rounded-3xl p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-extrabold">{a.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">العرض الحالي: {formatEgp(a.currentBidEgp)}</div>
                </div>
                <Badge variant={a.type === "sell" ? "success" : "brand"} className="rounded-full">
                  {a.type === "sell" ? "بيع" : "شراء"}
                </Badge>
              </div>
              <div className="mt-3">
                <Button asChild variant="bid" className="w-full rounded-2xl">
                  <NavLink to={`/auction/${a.id}`}>متابعة المزايدة</NavLink>
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </main>
    </AppShell>
  );
}

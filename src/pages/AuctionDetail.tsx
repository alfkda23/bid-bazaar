import AppShell from "@/components/layout/AppShell";
import { auctions, formatCompact, formatEgp } from "@/data/mockAuctions";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CountdownPill from "@/components/auction/CountdownPill";
import AuctionImage from "@/components/auction/AuctionImage";
import BidHistoryTicker, { BidRow } from "@/components/auction/BidHistoryTicker";
import { ArrowLeft, MessageCircle, Share2, ShieldCheck, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

export default function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const auction = useMemo(() => auctions.find((a) => a.id === id) ?? auctions[0], [id]);

  const [bidValue, setBidValue] = useState(() => String(auction.currentBidEgp + auction.minIncrementEgp));
  const [highlightId, setHighlightId] = useState<string | undefined>(undefined);
  const [rows, setRows] = useState<BidRow[]>(() => {
    const base = auction.currentBidEgp;
    const now = Date.now();
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `r${i}`,
      trader: ["مصنع الواحة", "تاجر الجملة", "شركة توريد", "سوبر ماركت", "مستورد", "موزّع"][i] ?? "تاجر",
      amountEgp: base - (6 - i) * auction.minIncrementEgp,
      tsIso: new Date(now - (6 - i) * 70_000).toISOString(),
    }));
  });

  const minNext = auction.currentBidEgp + auction.minIncrementEgp;

  function placeBid(nextAmount: number) {
    const amount = Math.max(nextAmount, minNext);
    const newRow: BidRow = {
      id: `me-${Date.now()}`,
      trader: "أنت",
      amountEgp: amount,
      tsIso: new Date().toISOString(),
    };

    setRows((prev) => [newRow, ...prev]);
    setHighlightId(newRow.id);
    setBidValue(String(amount + auction.minIncrementEgp));

    toast.success("تم تسجيل عرضك بنجاح", {
      description: `قيمة العرض: ${formatEgp(amount)}`,
    });

    // Simulate an outbid moment occasionally
    window.setTimeout(() => {
      if (Math.random() < 0.45) {
        const outbidRow: BidRow = {
          id: `o-${Date.now()}`,
          trader: "منافس",
          amountEgp: amount + auction.minIncrementEgp,
          tsIso: new Date().toISOString(),
        };
        setRows((prev) => [outbidRow, ...prev]);
        setHighlightId(outbidRow.id);
        toast.error("تمت المزايدة عليك", {
          description: `العرض الحالي: ${formatEgp(outbidRow.amountEgp)}`,
        });
      } else {
        toast.message("أنت في الصدارة الآن", {
          description: "استمر بالمراقبة حتى نهاية المزاد.",
          icon: <Sparkles className="h-4 w-4" />,
        });
      }
    }, 1800);
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="رجوع">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 text-center">
            <div className="truncate text-sm font-extrabold">تفاصيل المزاد</div>
            <div className="text-xs text-muted-foreground">{auction.category}</div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="مشاركة"
              onClick={() => toast.message("تم تجهيز رابط المشاركة")}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-md gap-4 px-4 pb-24 pt-4">
        <section className="grid gap-3">
          <AuctionImage category={auction.category} className="h-52 w-full" />

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Badge variant={auction.type === "sell" ? "success" : "brand"} className="rounded-full">
                {auction.type === "sell" ? "بيع" : "شراء"}
              </Badge>
              <CountdownPill endsAt={auction.endsAt} size="lg" />
            </div>
            <h1 className="font-display text-xl font-extrabold leading-snug">{auction.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{auction.region}</span>
              <span aria-hidden>•</span>
              <span>
                الكمية: {formatCompact(auction.quantity)} {auction.unit}
              </span>
            </div>
          </div>

          <Card className="rounded-3xl p-4 shadow-soft">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-background/60 p-3">
                <div className="text-xs text-muted-foreground">العرض الفائز الآن</div>
                <div className="mt-1 text-lg font-extrabold">{formatEgp(auction.currentBidEgp)}</div>
              </div>
              <div className="rounded-2xl border bg-background/60 p-3">
                <div className="text-xs text-muted-foreground">عدد المشاركين</div>
                <div className="mt-1 text-lg font-extrabold">{formatCompact(auction.biddersCount)}</div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-3">
          <Card className="rounded-3xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">قدّم عرضك</div>
              <div className="text-xs text-muted-foreground">الحد الأدنى للزيادة: {formatEgp(auction.minIncrementEgp)}</div>
            </div>

            <div className="mt-3 grid gap-2">
              <label className="text-xs font-semibold text-muted-foreground">مبلغ العرض (ج.م)</label>
              <Input
                inputMode="numeric"
                value={bidValue}
                onChange={(e) => setBidValue(e.target.value)}
                className="h-12 rounded-2xl text-base font-extrabold"
              />

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="soft"
                  className="rounded-2xl"
                  onClick={() => placeBid(Number(bidValue) + auction.minIncrementEgp)}
                >
                  +{formatCompact(auction.minIncrementEgp)}
                </Button>
                <Button
                  variant="soft"
                  className="rounded-2xl"
                  onClick={() => placeBid(Number(bidValue) + auction.minIncrementEgp * 2)}
                >
                  +{formatCompact(auction.minIncrementEgp * 2)}
                </Button>
                <Button
                  variant="soft"
                  className="rounded-2xl"
                  onClick={() => placeBid(Number(bidValue) + auction.minIncrementEgp * 5)}
                >
                  +{formatCompact(auction.minIncrementEgp * 5)}
                </Button>
              </div>

              <Button
                variant="bid"
                size="xl"
                className="mt-1 w-full rounded-2xl"
                onClick={() => placeBid(Number(bidValue))}
              >
                تأكيد العرض
              </Button>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl"
                  onClick={() => toast.message("سيتم تفعيل المحادثة قريباً")}
                >
                  <MessageCircle className="ml-2 h-4 w-4" />
                  محادثة
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl"
                  onClick={() => toast.message("تم نسخ الرابط")}
                >
                  <Share2 className="ml-2 h-4 w-4" />
                  مشاركة
                </Button>
              </div>
            </div>
          </Card>

          <BidHistoryTicker rows={rows} highlightId={highlightId} />

          <Card className="rounded-3xl p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">الطرف الآخر</div>
              <Badge variant="secondary" className="rounded-full">
                <ShieldCheck className="ml-1 h-4 w-4" />
                موثّق
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border bg-background/60">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-bold">{auction.ownerName}</div>
                <div className="text-sm text-muted-foreground">تقييم: {auction.ownerRating.toFixed(1)} / 5</div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}

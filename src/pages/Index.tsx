import AppShell from "@/components/layout/AppShell";
import AuctionCard from "@/components/auction/AuctionCard";
import { auctions } from "@/data/mockAuctions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

const Index = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "sell" | "buy">("all");

  const filtered = useMemo(() => {
    const q = query.trim();
    return auctions.filter((a) => {
      const matchesType = type === "all" ? true : a.type === type;
      const matchesQuery = !q
        ? true
        : [a.title, a.category, a.region].some((v) => v.toLowerCase().includes(q.toLowerCase()));
      return matchesType && matchesQuery;
    });
  }, [query, type]);

  return (
    <AppShell>
      <header className="px-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">بورصة الغذاء</p>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Souq El Gheza</h1>
          </div>
          <Badge variant="brand" className="shrink-0">
            مزادات مباشرة
          </Badge>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن سلعة، فئة، محافظة…"
              className="h-11 rounded-xl pr-10"
            />
          </div>
          <Button variant="soft" size="icon" aria-label="فلترة">
            <Filter />
          </Button>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant={type === "all" ? "hero" : "outline"}
            size="sm"
            onClick={() => setType("all")}
            className="rounded-full"
          >
            الكل
          </Button>
          <Button
            variant={type === "sell" ? "hero" : "outline"}
            size="sm"
            onClick={() => setType("sell")}
            className="rounded-full"
          >
            بيع
          </Button>
          <Button
            variant={type === "buy" ? "hero" : "outline"}
            size="sm"
            onClick={() => setType("buy")}
            className="rounded-full"
          >
            شراء
          </Button>
        </div>
      </header>

      <main className="px-4 pb-24 pt-4">
        <section className="grid gap-3">
          {filtered.map((a) => (
            <AuctionCard key={a.id} auction={a} />
          ))}

          {!filtered.length && (
            <div className="rounded-2xl border bg-card p-6 text-center shadow-soft">
              <p className="font-semibold">لا توجد نتائج مطابقة</p>
              <p className="mt-1 text-sm text-muted-foreground">جرّب كلمات مختلفة أو غيّر نوع المزاد.</p>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
};

export default Index;

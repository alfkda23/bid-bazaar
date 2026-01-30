import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CreateAuction() {
  return (
    <AppShell>
      <main className="mx-auto grid max-w-md gap-4 px-4 pb-24 pt-5">
        <header>
          <p className="text-sm text-muted-foreground">إضافة عرض جديد</p>
          <h1 className="font-display text-2xl font-extrabold">إنشاء مزاد</h1>
        </header>

        <Card className="rounded-3xl p-4 shadow-soft">
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("تم حفظ المسودة", { description: "سنربطها بالبيانات الحقيقية لاحقاً عبر Cloud." });
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-bold">
                نوع المزاد
              </Label>
              <Select defaultValue="sell">
                <SelectTrigger id="type" className="h-12 rounded-2xl">
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sell">بيع</SelectItem>
                  <SelectItem value="buy">شراء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-bold">
                اسم السلعة
              </Label>
              <Input id="title" placeholder="مثال: أرز أبيض مصري" className="h-12 rounded-2xl" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="qty" className="text-sm font-bold">
                  الكمية
                </Label>
                <Input id="qty" inputMode="numeric" placeholder="22" className="h-12 rounded-2xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit" className="text-sm font-bold">
                  الوحدة
                </Label>
                <Select defaultValue="ton">
                  <SelectTrigger id="unit" className="h-12 rounded-2xl">
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ton">طن</SelectItem>
                    <SelectItem value="carton">كرتونة</SelectItem>
                    <SelectItem value="kg">كيلو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="start" className="text-sm font-bold">
                  سعر البداية (ج.م)
                </Label>
                <Input id="start" inputMode="numeric" placeholder="26300" className="h-12 rounded-2xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inc" className="text-sm font-bold">
                  الحد الأدنى للزيادة
                </Label>
                <Input id="inc" inputMode="numeric" placeholder="250" className="h-12 rounded-2xl" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-sm font-bold">
                تفاصيل إضافية
              </Label>
              <Textarea id="notes" placeholder="الجودة، شروط التسليم، الدفع…" className="min-h-24 rounded-2xl" />
            </div>

            <Button variant="hero" size="xl" className="w-full rounded-2xl" type="submit">
              حفظ ومتابعة
            </Button>
          </form>
        </Card>
      </main>
    </AppShell>
  );
}

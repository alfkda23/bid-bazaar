import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { adminDocuments, adminUsers, formatDateTimeAr, kycBadgeVariant, kycLabel } from "@/data/mockAdmin";
import { NavLink } from "@/components/NavLink";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Ban, CheckCircle2, FileText, ShieldAlert, ShieldCheck } from "lucide-react";

type AccountAction = "activate" | "suspend" | "restrict_auctions";

export default function AdminUser() {
  const { id } = useParams();
  const user = useMemo(() => adminUsers.find((u) => u.id === id), [id]);
  const docs = useMemo(() => adminDocuments.filter((d) => d.userId === id), [id]);

  const [actionLog, setActionLog] = useState<string[]>([]);

  const log = (msg: string) => setActionLog((prev) => [msg, ...prev].slice(0, 6));

  const applyAction = (a: AccountAction) => {
    if (!user) return;
    const now = new Date().toISOString();
    if (a === "activate") log(`تم تفعيل الحساب • ${formatDateTimeAr(now)}`);
    if (a === "suspend") log(`تم إيقاف الحساب مؤقتًا • ${formatDateTimeAr(now)}`);
    if (a === "restrict_auctions") log(`تم تقييد إنشاء المزادات مؤقتًا • ${formatDateTimeAr(now)}`);
  };

  if (!user) {
    return (
      <AppShell>
        <main className="mx-auto grid max-w-md gap-4 px-4 pb-24 pt-5">
          <Card className="rounded-3xl p-6 text-center shadow-soft">
            <p className="font-extrabold">المستخدم غير موجود</p>
            <p className="mt-1 text-sm text-muted-foreground">تأكد من الرابط أو ارجع لقائمة الأدمن.</p>
            <Button asChild variant="hero" className="mt-4 w-full rounded-2xl">
              <NavLink to="/admin">العودة للوحة الإدارة</NavLink>
            </Button>
          </Card>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="mx-auto grid max-w-md gap-4 px-4 pb-24 pt-5">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">ملف المستخدم</p>
            <h1 className="truncate font-display text-2xl font-extrabold">{user.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={kycBadgeVariant(user.kycStatus)} className="rounded-full">
                {kycLabel(user.kycStatus)}
              </Badge>
              <Badge variant={user.status === "active" ? "success" : "danger"} className="rounded-full">
                {user.status === "active" ? "نشط" : "موقوف"}
              </Badge>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full">
            <NavLink to="/admin">رجوع</NavLink>
          </Button>
        </header>

        <Card className="rounded-3xl p-4 shadow-soft">
          <div className="grid gap-2">
            <div className="text-sm font-extrabold">معلومات أساسية</div>
            <div className="text-sm text-muted-foreground">الشركة: <span className="font-semibold text-foreground">{user.company ?? "—"}</span></div>
            <div className="text-sm text-muted-foreground">المحافظة: <span className="font-semibold text-foreground">{user.region}</span></div>
            <div className="text-sm text-muted-foreground">الهاتف: <span className="font-semibold text-foreground">{user.phone ?? "—"}</span></div>
            <div className="text-sm text-muted-foreground">تاريخ التسجيل: <span className="font-semibold text-foreground">{formatDateTimeAr(user.createdAt)}</span></div>
          </div>
        </Card>

        <Card className="rounded-3xl p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">إجراءات على الحساب</div>
            <Badge variant="secondary" className="rounded-full">
              Mock
            </Badge>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-3 gap-2">
            <Button variant="hero" size="sm" className="rounded-2xl" onClick={() => applyAction("activate")}>
              <ShieldCheck className="ml-2 h-4 w-4" />
              تفعيل
            </Button>
            <Button variant="soft" size="sm" className="rounded-2xl" onClick={() => applyAction("restrict_auctions")}>
              <ShieldAlert className="ml-2 h-4 w-4" />
              تقييد
            </Button>
            <Button variant="destructive" size="sm" className="rounded-2xl" onClick={() => applyAction("suspend")}>
              <Ban className="ml-2 h-4 w-4" />
              إيقاف
            </Button>
          </div>

          {!!actionLog.length && (
            <div className="mt-3 rounded-2xl border bg-card p-3">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <CheckCircle2 className="h-4 w-4" />
                سجل إجراءات (Mock)
              </div>
              <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                {actionLog.map((l, idx) => (
                  <li key={idx}>• {l}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold">المستندات المرفوعة</h2>
            <Badge variant="brand" className="rounded-full">
              <FileText className="ml-1 h-4 w-4" />
              {docs.length}
            </Badge>
          </div>

          {docs.map((d) => (
            <Card key={d.id} className="rounded-3xl p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-extrabold">{d.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">الملف: {d.fileName}</div>
                  <div className="mt-1 text-xs text-muted-foreground">رفع: {formatDateTimeAr(d.submittedAt)}</div>
                </div>
                <Badge variant={kycBadgeVariant(d.status)} className="rounded-full shrink-0">
                  {kycLabel(d.status)}
                </Badge>
              </div>

              {d.decisionNote && (
                <div className="mt-3 rounded-2xl border bg-card p-3 text-sm">
                  <div className="text-xs text-muted-foreground">ملاحظة</div>
                  <div className="mt-1 font-semibold">{d.decisionNote}</div>
                </div>
              )}
            </Card>
          ))}

          {!docs.length && (
            <Card className="rounded-3xl p-6 text-center shadow-soft">
              <p className="font-extrabold">لا توجد مستندات لهذا المستخدم</p>
              <p className="mt-1 text-sm text-muted-foreground">سيظهر هنا أي ملف يتم رفعه لاحقًا.</p>
            </Card>
          )}
        </section>
      </main>
    </AppShell>
  );
}

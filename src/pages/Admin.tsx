import AppShell from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink } from "@/components/NavLink";
import {
  adminDocuments,
  adminUsers,
  formatDateTimeAr,
  kycBadgeVariant,
  kycLabel,
  type AdminDocument,
  type KycStatus,
} from "@/data/mockAdmin";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, FileText, Shield, Users, XCircle } from "lucide-react";

type ReviewAction = "approve" | "reject" | "request_more";

function docTypeLabel(t: AdminDocument["type"]) {
  switch (t) {
    case "identity":
      return "هوية";
    case "company":
      return "شركة";
    case "other":
      return "أخرى";
  }
}

function statusIcon(s: KycStatus) {
  switch (s) {
    case "approved":
      return CheckCircle2;
    case "rejected":
      return XCircle;
    case "in_review":
      return Shield;
    case "pending":
      return Clock;
  }
}

export default function Admin() {
  const [userQuery, setUserQuery] = useState("");
  const [docQuery, setDocQuery] = useState("");
  const [docStatus, setDocStatus] = useState<KycStatus | "all">("all");

  const [docState, setDocState] = useState<AdminDocument[]>(adminDocuments);

  const usersFiltered = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return adminUsers;
    return adminUsers.filter((u) => {
      const hay = [u.name, u.company ?? "", u.region, u.phone ?? ""].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [userQuery]);

  const docsFiltered = useMemo(() => {
    const q = docQuery.trim().toLowerCase();
    return docState
      .filter((d) => (docStatus === "all" ? true : d.status === docStatus))
      .filter((d) => {
        if (!q) return true;
        const user = adminUsers.find((u) => u.id === d.userId);
        const hay = [d.title, d.fileName, docTypeLabel(d.type), user?.name ?? ""].join(" ").toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt));
  }, [docQuery, docState, docStatus]);

  const stats = useMemo(() => {
    const byStatus = (s: KycStatus) => docState.filter((d) => d.status === s).length;
    return {
      pending: byStatus("pending"),
      inReview: byStatus("in_review"),
      approved: byStatus("approved"),
      rejected: byStatus("rejected"),
      total: docState.length,
    };
  }, [docState]);

  const applyDecision = (docId: string, action: ReviewAction) => {
    setDocState((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const base = { ...d, lastDecisionAt: new Date().toISOString() };
        if (action === "approve") return { ...base, status: "approved", decisionNote: "تم الاعتماد" };
        if (action === "reject") return { ...base, status: "rejected", decisionNote: "تم الرفض — يرجى مراجعة المتطلبات" };
        return { ...base, status: "pending", decisionNote: "مطلوب مستندات إضافية/صورة أوضح" };
      }),
    );
  };

  return (
    <AppShell>
      <main className="mx-auto grid max-w-md gap-4 px-4 pb-24 pt-5">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Admin</p>
            <h1 className="font-display text-2xl font-extrabold">لوحة الإدارة</h1>
          </div>
          <Badge variant="brand" className="shrink-0 rounded-full">
            <Shield className="ml-1 h-4 w-4" />
            مراجعة وتحقق
          </Badge>
        </header>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="documents" className="rounded-xl">
              <FileText className="ml-2 h-4 w-4" />
              المستندات
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl">
              <Users className="ml-2 h-4 w-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="stats" className="rounded-xl">
              <Shield className="ml-2 h-4 w-4" />
              مؤشرات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-4 grid gap-3">
            <Card className="rounded-3xl p-4 shadow-soft">
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={docQuery}
                    onChange={(e) => setDocQuery(e.target.value)}
                    placeholder="بحث بالمستخدم/الملف…"
                    className="h-11 rounded-2xl"
                  />
                  <select
                    value={docStatus}
                    onChange={(e) => setDocStatus(e.target.value as KycStatus | "all")}
                    className={cn(
                      "h-11 w-full rounded-2xl border bg-background px-3 text-sm font-semibold",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                    aria-label="فلترة الحالة"
                  >
                    <option value="all">كل الحالات</option>
                    <option value="pending">معلّق</option>
                    <option value="in_review">قيد المراجعة</option>
                    <option value="approved">تم الاعتماد</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">معلّق</div>
                    <div className="mt-1 text-lg font-extrabold">{stats.pending}</div>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">قيد المراجعة</div>
                    <div className="mt-1 text-lg font-extrabold">{stats.inReview}</div>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">تم الاعتماد</div>
                    <div className="mt-1 text-lg font-extrabold">{stats.approved}</div>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <div className="text-xs text-muted-foreground">مرفوض</div>
                    <div className="mt-1 text-lg font-extrabold">{stats.rejected}</div>
                  </div>
                </div>
              </div>
            </Card>

            <section className="grid gap-3">
              {docsFiltered.map((d) => {
                const user = adminUsers.find((u) => u.id === d.userId);
                const Icon = statusIcon(d.status);

                return (
                  <Card key={d.id} className="rounded-3xl p-4 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={kycBadgeVariant(d.status)} className="rounded-full">
                            <Icon className="ml-1 h-4 w-4" />
                            {kycLabel(d.status)}
                          </Badge>
                          <Badge variant="secondary" className="rounded-full">
                            {docTypeLabel(d.type)}
                          </Badge>
                        </div>

                        <div className="mt-2 truncate text-base font-extrabold">{d.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {user ? `${user.name} • ${user.region}` : "مستخدم غير معروف"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">تم الرفع: {formatDateTimeAr(d.submittedAt)}</div>
                      </div>

                      <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full">
                        <NavLink to={`/admin/users/${d.userId}`}>تفاصيل</NavLink>
                      </Button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        className="rounded-2xl"
                        onClick={() => applyDecision(d.id, "approve")}
                      >
                        اعتماد
                      </Button>
                      <Button
                        variant="soft"
                        size="sm"
                        className="rounded-2xl"
                        onClick={() => applyDecision(d.id, "request_more")}
                      >
                        طلب توضيح
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-2xl"
                        onClick={() => applyDecision(d.id, "reject")}
                      >
                        رفض
                      </Button>
                    </div>

                    {d.decisionNote && (
                      <div className="mt-3 rounded-2xl border bg-card p-3 text-sm">
                        <div className="text-xs text-muted-foreground">آخر ملاحظة</div>
                        <div className="mt-1 font-semibold">{d.decisionNote}</div>
                        {d.lastDecisionAt && (
                          <div className="mt-1 text-xs text-muted-foreground">{formatDateTimeAr(d.lastDecisionAt)}</div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}

              {!docsFiltered.length && (
                <Card className="rounded-3xl p-6 text-center shadow-soft">
                  <p className="font-extrabold">لا توجد مستندات مطابقة</p>
                  <p className="mt-1 text-sm text-muted-foreground">جرّب تغيير الفلتر أو البحث.</p>
                </Card>
              )}
            </section>
          </TabsContent>

          <TabsContent value="users" className="mt-4 grid gap-3">
            <Card className="rounded-3xl p-4 shadow-soft">
              <div className="grid gap-2">
                <div className="text-sm font-extrabold">قائمة المستخدمين</div>
                <Input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="بحث باسم/شركة/محافظة/هاتف…"
                  className="h-11 rounded-2xl"
                />
              </div>
            </Card>

            <section className="grid gap-3">
              {usersFiltered.map((u) => (
                <Card key={u.id} className="rounded-3xl p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-base font-extrabold">{u.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{u.company ?? ""} {u.company ? "•" : ""} {u.region}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant={kycBadgeVariant(u.kycStatus)} className="rounded-full">
                          {kycLabel(u.kycStatus)}
                        </Badge>
                        <Badge variant={u.status === "active" ? "success" : "danger"} className="rounded-full">
                          {u.status === "active" ? "نشط" : "موقوف"}
                        </Badge>
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full">
                      <NavLink to={`/admin/users/${u.id}`}>فتح</NavLink>
                    </Button>
                  </div>
                </Card>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="stats" className="mt-4 grid gap-3">
            <Card className="rounded-3xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold">مؤشرات اليوم (Mock)</div>
                  <div className="mt-1 text-sm text-muted-foreground">مراقبة أداء المراجعة ومخاطر الحسابات</div>
                </div>
                <Badge variant="brand" className="rounded-full">
                  {stats.total} ملف
                </Badge>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="rounded-3xl p-4 shadow-soft">
                <div className="text-xs text-muted-foreground">متوسط زمن المراجعة</div>
                <div className="mt-2 text-lg font-extrabold">3.2 ساعة</div>
                <div className="mt-1 text-sm text-muted-foreground">هدفنا: أقل من 6 ساعات</div>
              </Card>
              <Card className="rounded-3xl p-4 shadow-soft">
                <div className="text-xs text-muted-foreground">حسابات موقوفة</div>
                <div className="mt-2 text-lg font-extrabold">1</div>
                <div className="mt-1 text-sm text-muted-foreground">مراجعة أسباب الإيقاف</div>
              </Card>
            </div>

            <Card className="rounded-3xl p-4 shadow-soft">
              <div className="text-sm font-extrabold">تنبيهات</div>
              <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                <li>• ملفات معلّقة منذ أكثر من 24 ساعة: 1</li>
                <li>• طلبات توضيح لم تُستكمل: 2</li>
                <li>• مستخدمون بحاجة لتعيين مراجع: 1</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </AppShell>
  );
}

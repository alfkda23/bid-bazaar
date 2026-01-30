export type AdminUserStatus = "active" | "suspended";
export type KycStatus = "pending" | "in_review" | "approved" | "rejected";
export type DocumentStatus = KycStatus;

export type DocumentType = "identity" | "company" | "other";

export type AdminDocument = {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  fileName: string;
  status: DocumentStatus;
  submittedAt: string; // ISO
  assignedReviewer?: string;
  lastDecisionAt?: string; // ISO
  decisionNote?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  phone?: string;
  company?: string;
  region: string;
  createdAt: string; // ISO
  status: AdminUserStatus;
  kycStatus: KycStatus;
};

const now = Date.now();
const hours = (h: number) => h * 60 * 60_000;
const days = (d: number) => d * 24 * 60 * 60_000;

export const adminUsers: AdminUser[] = [
  {
    id: "u1",
    name: "شركة النيل للتوريد",
    phone: "+20 10 1234 5678",
    company: "النيل للتوريد",
    region: "القليوبية",
    createdAt: new Date(now - days(14)).toISOString(),
    status: "active",
    kycStatus: "in_review",
  },
  {
    id: "u2",
    name: "متجر الرحاب",
    phone: "+20 12 9876 5432",
    company: "الرحاب للتجارة",
    region: "الجيزة",
    createdAt: new Date(now - days(3)).toISOString(),
    status: "active",
    kycStatus: "pending",
  },
  {
    id: "u3",
    name: "مصنع الساحل",
    phone: "+20 11 2222 2222",
    company: "الساحل للصناعات الغذائية",
    region: "الإسكندرية",
    createdAt: new Date(now - days(35)).toISOString(),
    status: "active",
    kycStatus: "approved",
  },
  {
    id: "u4",
    name: "تاجر الجملة - أبو عوف",
    phone: "+20 10 5555 0101",
    company: "أبو عوف",
    region: "المنوفية",
    createdAt: new Date(now - days(1)).toISOString(),
    status: "suspended",
    kycStatus: "rejected",
  },
];

export const adminDocuments: AdminDocument[] = [
  {
    id: "d1",
    userId: "u1",
    type: "company",
    title: "سجل تجاري",
    fileName: "commercial-register_u1.pdf",
    status: "in_review",
    submittedAt: new Date(now - hours(6)).toISOString(),
    assignedReviewer: "مريم",
  },
  {
    id: "d2",
    userId: "u1",
    type: "identity",
    title: "بطاقة شخصية",
    fileName: "national-id_u1.jpg",
    status: "pending",
    submittedAt: new Date(now - hours(2)).toISOString(),
  },
  {
    id: "d3",
    userId: "u2",
    type: "company",
    title: "بطاقة ضريبية",
    fileName: "tax-card_u2.pdf",
    status: "pending",
    submittedAt: new Date(now - hours(20)).toISOString(),
  },
  {
    id: "d4",
    userId: "u4",
    type: "other",
    title: "تفويض توقيع",
    fileName: "authorization_u4.pdf",
    status: "rejected",
    submittedAt: new Date(now - days(2)).toISOString(),
    lastDecisionAt: new Date(now - days(1)).toISOString(),
    decisionNote: "صورة غير واضحة — يرجى إعادة الرفع بدقة أعلى.",
    assignedReviewer: "أحمد",
  },
];

export function formatDateTimeAr(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function kycLabel(status: KycStatus) {
  switch (status) {
    case "pending":
      return "معلّق";
    case "in_review":
      return "قيد المراجعة";
    case "approved":
      return "تم الاعتماد";
    case "rejected":
      return "مرفوض";
  }
}

export function kycBadgeVariant(status: KycStatus): "success" | "danger" | "brand" | "secondary" {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "in_review":
      return "brand";
    case "pending":
      return "secondary";
  }
}

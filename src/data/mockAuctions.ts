export type AuctionType = "sell" | "buy";

export type AuctionStatus = "active" | "ending" | "ended";

export type Auction = {
  id: string;
  type: AuctionType;
  title: string;
  category: string;
  region: string;
  unit: string;
  quantity: number;
  startsAt: string; // ISO
  endsAt: string; // ISO
  currentBidEgp: number;
  minIncrementEgp: number;
  bidsCount: number;
  biddersCount: number;
  status: AuctionStatus;
  ownerName: string;
  ownerRating: number; // 0-5
};

const now = Date.now();
const minutes = (m: number) => m * 60_000;

export const auctions: Auction[] = [
  {
    id: "a1",
    type: "sell",
    title: "أرز أبيض مصري - درجة أولى",
    category: "حبوب",
    region: "القليوبية",
    unit: "طن",
    quantity: 22,
    startsAt: new Date(now - minutes(15)).toISOString(),
    endsAt: new Date(now + minutes(48)).toISOString(),
    currentBidEgp: 26300,
    minIncrementEgp: 250,
    bidsCount: 17,
    biddersCount: 6,
    status: "active",
    ownerName: "شركة النيل للتوريد",
    ownerRating: 4.7,
  },
  {
    id: "a2",
    type: "buy",
    title: "طلب شراء سكر أبيض - توريد سريع",
    category: "سكر",
    region: "الجيزة",
    unit: "طن",
    quantity: 12,
    startsAt: new Date(now - minutes(5)).toISOString(),
    endsAt: new Date(now + minutes(11)).toISOString(),
    currentBidEgp: 31800,
    minIncrementEgp: 300,
    bidsCount: 9,
    biddersCount: 4,
    status: "ending",
    ownerName: "متجر الرحاب",
    ownerRating: 4.3,
  },
  {
    id: "a3",
    type: "sell",
    title: "زيت عباد 1 لتر كرتونة 12",
    category: "زيوت",
    region: "الإسكندرية",
    unit: "كرتونة",
    quantity: 180,
    startsAt: new Date(now - minutes(60)).toISOString(),
    endsAt: new Date(now + minutes(120)).toISOString(),
    currentBidEgp: 1015,
    minIncrementEgp: 10,
    bidsCount: 31,
    biddersCount: 11,
    status: "active",
    ownerName: "مصنع الساحل",
    ownerRating: 4.9,
  },
  {
    id: "a4",
    type: "buy",
    title: "طلب شراء فول بلدي - جودة عالية",
    category: "حبوب",
    region: "المنوفية",
    unit: "طن",
    quantity: 8,
    startsAt: new Date(now - minutes(8)).toISOString(),
    endsAt: new Date(now + minutes(70)).toISOString(),
    currentBidEgp: 28750,
    minIncrementEgp: 250,
    bidsCount: 12,
    biddersCount: 5,
    status: "active",
    ownerName: "تاجر الجملة - أبو عوف",
    ownerRating: 4.1,
  },
];

export function formatEgp(value: number) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(value);
}

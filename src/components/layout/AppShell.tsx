import { ReactNode } from "react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Gavel, Home, LayoutDashboard, PlusCircle } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "المزادات", icon: Gavel, end: true },
  { to: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/create", label: "إنشاء", icon: PlusCircle },
];

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh">
      {children}

      <nav
        aria-label="التنقل السفلي"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  "group flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-muted-foreground transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
                activeClassName="bg-accent text-foreground"
              >
                <Icon className="h-5 w-5" />
                <span className="leading-none">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

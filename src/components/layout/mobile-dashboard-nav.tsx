"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileDashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-t border-border bg-background px-3 py-2 lg:hidden">
      {dashboardNavigation.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              isActive &&
                "bg-muted text-foreground shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset]",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

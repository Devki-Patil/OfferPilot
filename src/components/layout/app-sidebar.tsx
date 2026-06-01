"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-dvh w-72 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <span className="flex size-9 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset]">
          OP
        </span>
        <span className="font-heading text-sm font-semibold text-sidebar-foreground">
          {siteConfig.name}
        </span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
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
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset]",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

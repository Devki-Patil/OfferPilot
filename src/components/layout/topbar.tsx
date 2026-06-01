import { Bell, Command, Search } from "lucide-react";

import { ClerkUserMenu } from "@/components/layout/clerk-user-menu";
import { MobileDashboardNav } from "@/components/layout/mobile-dashboard-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isClerkConfigured } from "@/lib/clerk/config";

export async function Topbar() {
  const showUserMenu = isClerkConfigured();
  
  return (
    <div className="sticky top-0 z-20 border-b border-border bg-background">
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative hidden min-w-80 items-center md:flex">
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
            <Input
              className="h-9 pl-9 pr-16"
              placeholder="Search offers, accounts, or decisions"
              aria-label="Search"
            />
            <kbd className="pointer-events-none absolute right-2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Command className="inline size-3" aria-hidden="true" /> K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="size-4" aria-hidden="true" />
          </Button>
          <Button className="hidden sm:inline-flex">New offer</Button>
          {showUserMenu && <ClerkUserMenu />}
        </div>
      </header>
      <MobileDashboardNav />
    </div>
  );
}

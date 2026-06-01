"use client"

import { UserButton } from "@clerk/nextjs"

export function ClerkUserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-8",
          userButtonPopoverCard: "bg-card border border-border text-foreground",
        },
      }}
    />
  )
}

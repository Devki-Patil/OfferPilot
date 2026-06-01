import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { clerkPaths, isClerkConfigured } from "@/lib/clerk/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OfferPilot AI",
    template: "%s | OfferPilot AI",
  },
  description: "AI-native offer management workspace for modern revenue teams.",
  applicationName: "OfferPilot AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = isClerkConfigured() ? (
    <ClerkProvider
      signInUrl={clerkPaths.signInUrl}
      signUpUrl={clerkPaths.signUpUrl}
    >
      {children}
    </ClerkProvider>
  ) : (
    children
  );

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {content}
      </body>
    </html>
  );
}

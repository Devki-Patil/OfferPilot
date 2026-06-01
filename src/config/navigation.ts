import {
  BarChart3,
  BriefcaseBusiness,
  CircleUserRound,
  LayoutDashboard,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const dashboardNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Offers",
    href: "/offers",
    icon: BriefcaseBusiness,
  },
  {
    title: "AI Scoring",
    href: "/scoring",
    icon: Sparkles,
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: BarChart3,
  },
  {
    title: "Team",
    href: "/team",
    icon: UsersRound,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: CircleUserRound,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const;

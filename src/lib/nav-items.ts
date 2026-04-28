import {
  LayoutDashboard,
  Users,
  Phone,
  CreditCard,
  Megaphone,
  Contact,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon: LucideIcon;
  items?: { title: string; href: string }[];
};

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

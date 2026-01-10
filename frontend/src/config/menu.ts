import { LayoutDashboard, History, Users, FileSpreadsheet } from "lucide-react";
import type { MenuItem } from "./types";

export const generalMenu: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My History",
    href: "/history",
    icon: History,
  },
];

export const adminMenu: MenuItem[] = [
  {
    title: "Attendance Recap",
    href: "/admin/recap",
    icon: FileSpreadsheet,
  },
  {
    title: "Employees",
    href: "/admin/employees",
    icon: Users,
  },
];

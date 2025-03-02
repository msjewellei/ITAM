import { ClipboardCheck, LayoutDashboard, Package, UserRound, Wrench } from "lucide-react";

export const links = [
  {
    path: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    path: "/Assets",
    icon: ClipboardCheck,
    label: "Assets",
  },
  {
    path: "/Borrowed",
    icon: Package,
    label: "Borrowed",
  },
  {
    path: "/Repair",
    icon: Wrench,
    label: "Repair",
  },
  {
    path: "/Issuance",
    icon: () => (
      <div className="w-20 flex flex-row justify-center mt-8">
        <UserRound size={32} color="#ffffff" strokeWidth={1.5}/>
        <Package size={18} color="#ffffff" strokeWidth={1.5} className="ml-0 pl-0" />
      </div>
    ),
    label: "Issuance",
  },
];

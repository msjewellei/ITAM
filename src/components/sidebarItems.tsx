import { Link } from "react-router-dom";

interface SidebarItemProps {
  icon?: any;
  label: string;
  path: string;
  sublinks?: SidebarItemProps[];
}

function SidebarItem({ icon: Icon, label, path }: SidebarItemProps) {
  return (
    <>
      <Link to={path} className="flex flex-col items-center">
        <Icon size={30} color="#ffffff" strokeWidth={1.5} className="mt-8" />
        <p className="text-white text-xs font-light">{label}</p>
      </Link>
    </>
  );
}

export default SidebarItem;

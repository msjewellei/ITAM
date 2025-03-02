import SidebarItem from "./sidebarItems";
import { links } from "./sidebarLinks";

function Sidebar() {
  return (
    <div className="w-20 h-screen bg-[#233345] flex flex-col items-center fixed left-0">
      {links.map((link) => (
        <SidebarItem key={link.path} {...link} />
      ))}
    </div>
  );
}

export default Sidebar;

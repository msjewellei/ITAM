import SidebarItem from "./sidebarItems";
import { links } from "./sidebarLinks";

function Sidebar() {
  return (
    <div className="flex-1 w-20px h-screen bg-[#233345] flex flex-col items-center fixed left-0">
      {links.map((link) => (
        <SidebarItem key={link.path} {...link} />
      ))}
    </div>
  );
}

export default Sidebar;

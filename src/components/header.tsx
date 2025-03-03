import logo from "../assets/logo.png";
import { Bell } from "lucide-react";

function Header() {
  return (
    <div className="w-full bg-white flex flex-row items-center justify-between gap-4 p-4 sticky top-0 z-50">
      <img src={logo} className="h-13" />
      <h3 className="mr-auto">IT Asset Management</h3>
      <Bell />
    </div>
  );
}

export default Header;

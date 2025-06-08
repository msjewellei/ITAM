import logo from "../assets/logo.png";

function Header() {
  return (
    <div className="w-auto bg-white flex flex-row items-center justify-between gap-4 p-4 sticky top-0 z-50">
      <img src={logo} className="h-13" />
      <h3 className="mr-auto">IT Asset Management</h3>
    </div>
  );
}

export default Header;

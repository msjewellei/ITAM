import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Borrowed from "./components/borrowed";
import Repair from "./components/repair";
import Issuance from "./components/issuance";
import External from "./components/externalAssets";
import Assets from "./components/assets";

const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/Assets", element: <Assets /> },
  { path: "/External", element: <External /> },
  { path: "/Borrowed", element: <Borrowed /> },
  { path: "/Repair", element: <Repair /> },
  { path: "/Issuance", element: <Issuance /> },
];

function App() {
  return (
    <>
      <Header />
      <div className="flex flex-row bg-slate-200">
        <Sidebar />
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </>
  );
}

export default App;

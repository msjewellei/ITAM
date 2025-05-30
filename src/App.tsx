import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Borrowed from "./components/borrowed";
import Repair from "./components/repair";
import External from "./components/externalAssets";
import Assets from "./components/assets";
import Issuance from "./components/issuance";
import AssetForm from "./components/assetForm.copy";
import BorrowForm from "./components/borrowForm";
import RepairForm from "./components/repairForm";
import IssuanceForm from "./components/issuanceForm";
import { Toaster } from "./components/ui/sonner";
import { UpdateAsset } from "./components/editAsset";
import SettingsPage from "./components/settings";
import AssetBatch from "./components/assetBatch";

const routes = [
  { path: "/", element: <Dashboard /> },
  { path: "/assets/*", element: <Assets /> },
  { path: "/external", element: <External /> },
  { path: "/borrowed", element: <Borrowed /> },
  { path: "/repair", element: <Repair /> },
  { path: "/issuance", element: <Issuance /> },
  { path: "/assets/add", element: <AssetForm /> },
  { path: "/assets/add/multiple", element: <AssetBatch /> },
  { path: "/borrowed/add", element: <BorrowForm /> },
  { path: "/repair/add", element: <RepairForm /> },
  { path: "/issuance/add", element: <IssuanceForm /> },
  { path: "/assets/update", element: <UpdateAsset /> },
  { path: "/settings", element: <SettingsPage /> },
];

function App() {
  return (
    <>
      <Header />
      <div className="flex flex-row bg-slate-200 min-h-screen w-full overflow-x-hidden">
        <Sidebar />
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
      <Toaster richColors />
    </>
  );
}

export default App;

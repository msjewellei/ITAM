import { useDashboard } from "@/context/dashboardContext";
import DashboardCard from "./DashboardCard";

function Card() {
  const {
    totalAssets,
    availableAssets,
    issuedAssets,
    borrowedAssets,
    underRepairAssets,
  } = useDashboard();

  return (
    <div className="w-full h-1/3 flex flex-row justify-around items-start gap-3 px-4 pt-4">
      <DashboardCard title="Total Assets" value={totalAssets} className="w-full h-full" />
      <DashboardCard title="Available Assets" value={availableAssets} className="w-full h-full" />
      <DashboardCard title="Issued Assets" value={issuedAssets} className="w-full h-full" />
      <DashboardCard title="Borrowed Assets" value={borrowedAssets} className="w-full h-full" />
      <DashboardCard title="Under Repair" value={underRepairAssets} className="w-full h-full" />
    </div>
  );
}

export default Card;

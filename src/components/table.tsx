import { DashboardTable } from "@/components/dashboardTbl";
import { useDashboard } from "@/context/dashboardContext";

export default function Tablee() {
  const { overdueAssets, urgentRepairs } = useDashboard();

  const overdueColumns = [
    { key: "asset_name", label: "Asset", className: "w-1/3" },
    { key: "full_name", label: "Borrower", className: "w-1/3" },
    {
      key: "days_overdue",
      label: "Overdue Days",
      className: "w-1/3",
      alignRight: true,
    },
  ];

  const repairColumns = [
    { key: "asset_name", label: "Asset", className: "w-1/4" },
    { key: "reported_by", label: "Requester", className: "w-1/4" },
    { key: "issue", label: "Issue", className: "w-1/4" },
    { key: "date_reported", label: "Date Reported", className: "w-1/4" },
  ];

  return (
    <div className="w-full h-1/2 flex flex-row justify-around items-start gap-2 pl-4 pr-4">
      <div className="bg-white h-full rounded-lg w-1/2 shadow-lg overflow-y-auto">
        <DashboardTable
          title="Overdue Borrowed Assets"
          columns={overdueColumns}
          data={overdueAssets}
        />
      </div>
      <div className="bg-white h-full rounded-lg w-1/2 shadow-lg">
        <DashboardTable
          title="Urgent Repair List"
          columns={repairColumns}
          data={urgentRepairs}
        />
      </div>
    </div>
  );
}

import { useDashboard } from "@/context/dashboardContext";
import { ChartBarDefault } from "./ui/barchart";

function BarChart() {
  const { borrowedByCompany, issuedByCompany } = useDashboard();

  return (
    <div className="w-full h-1/2 flex flex-row justify-around items-start gap-2 pl-4 pr-4 pt-0">
      <div className="bg-white h-full rounded-lg w-1/2 shadow-lg">
        <ChartBarDefault
          data={borrowedByCompany}
          dataKey="borrowed_count"
          xKey="company_alias"
          title="Borrowed Assets by Company"
        />
      </div>
      <div className="bg-white h-full rounded-lg w-1/2 shadow-lg">
        <ChartBarDefault
          data={issuedByCompany}
          dataKey="issued_count"
          xKey="company_alias"
          title="Issued Assets by Company"
        />
      </div>
    </div>
  );
}

export default BarChart;

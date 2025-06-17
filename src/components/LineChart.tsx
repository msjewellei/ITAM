import { useDashboard } from "@/context/dashboardContext";
import { ChartLineDefault } from "./ui/linechart";
import { PieCharts } from "./ui/piechart";

function LineChart() {
  const { monthlyRepairs, assetsByCondition } = useDashboard();

  return (
    <div className="w-full flex flex-col md:flex-row justify-around items-stretch gap-2 px-4 pb-5">
      <div className="bg-white h-full rounded-lg w-full md:w-2/3 shadow-lg">
        <ChartLineDefault
          data={monthlyRepairs}
          dataKey="repair_count"
          xKey="month"
          title="Monthly Asset Repair Trend"
        />
      </div>
      <div className="bg-white rounded-lg w-full md:w-1/3 shadow-lg">
        <PieCharts
          title="Assets by Condition"
          data={assetsByCondition}
          dataKey="count"
          nameKey="asset_condition_name"
          config={{}}
        />
      </div>
    </div>
  );
}

export default LineChart;

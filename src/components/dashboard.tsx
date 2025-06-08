import Card from "./Card";
import LineChart from "./LineChart";
import Tablee from "./Table";
import BarChart from "./barchart";

function Dashboard() {
  return (
    <>
      <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 flex flex-col h-screen gap-4">
        <Card />
        <Tablee />
        <BarChart />
        <LineChart />
      </div>
    </>
  );
}

export default Dashboard;

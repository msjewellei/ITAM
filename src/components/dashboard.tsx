import FourCards from "./ui/fourdashboardcard"; 
import TwoCards from "./ui/twodashboardcard";

function Dashboard() {
  return (
    <>
    
      <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 flex flex-col h-screen gap-4">
        <FourCards />
        <TwoCards />
        <TwoCards />
      </div>
    </>
  );
}

export default Dashboard;


import { columns } from "./repairColumns";
import { RepairDataTable } from "./repairTable";
import { useRepair } from "@/context/repairContext";
import { Dialog } from "./ui/dialog";

export default function Repair() {
  const { repair } = useRepair();

  return (
    <>
      <Dialog>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Repair Assets</p>
          <div className="flex-1 min-h-0">
            <RepairDataTable columns={columns} data={repair} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

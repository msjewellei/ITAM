import { columns } from "./repairColumns";
import { useRepair } from "@/context/repairContext";
import { Dialog } from "./ui/dialog";
import { DataTable } from "./dataTable";

export default function Repair() {
  const { repair } = useRepair();

  return (
    <>
      <Dialog>
        <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)]  pl-[calc(7rem+10px)] w-full max-w-full">
          <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] flex flex-col">
            <p className="font-medium text-lg mt-5 px-10">Repair Assets</p>
            <div className="flex-1 min-h-0">
              <DataTable
                columns={columns}
                data={repair}
                showAddButton
                addButtonPath="/repair/add"
                hiddenColumns={[
                  "remarks",
                  "date_reported",
                  "repair_start_date",
                  "repair_completion_date",
                  "repair_cost",
                  "department_name",
                ]}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

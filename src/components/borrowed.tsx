import { useBorrow } from "@/context/borrowContext";
import { columns } from "./borrowedColumns";
import { Dialog } from "./ui/dialog";
import { DataTable } from "./dataTable";

export default function Borrowed() {
  const { borrow } = useBorrow();
  return (
    <Dialog>
      <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)]  pl-[calc(7rem+10px)] w-full max-w-full">
        <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] flex flex-col">
          <p className="font-medium text-lg mt-5 px-10">Borrowed Assets</p>
          <div className="flex-1 min-h-0">
            <DataTable
              columns={columns}
              data={borrow}
              showAddButton
              addButtonPath="/borrowed/add"
              hiddenColumns={["due_date", "return_date", "duration", "remarks"]}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

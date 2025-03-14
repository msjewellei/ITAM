import { useBorrow } from "@/context/borrowContext";
import { columns } from "./borrowedColumns";
import { BorrowedDataTable } from "./borrowedTable";

export default function Borrowed() {
  const { borrow } = useBorrow();
  return (
    <>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Borrowed Assets</p>
          <div className="flex-1 min-h-0">
            <BorrowedDataTable columns={columns} data={borrow} />
          </div>
        </div>
    </>
  );
}

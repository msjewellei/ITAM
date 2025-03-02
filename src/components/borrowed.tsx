import { BorrowedAsset, columns } from "./borrowedColumns";
import { BorrowedDataTable } from "./borrowedTable";
import { Dialog } from "./ui/dialog";

export default function Borrowed() {
  const data: BorrowedAsset[] = [
    {
      id: "3",
      userId: 1,
      userName: "Jewel Lei 3",
      assetId: 1,
      assetName: "Borrowed Asset 3",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "2",
      userId: 2,
      userName: "Jewel Lei 2",
      assetId: 2,
      assetName: "Borrowed Asset 2",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
  ];

  return (
    <>
      <Dialog>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Borrowed Assets</p>
          <div className="container py-3 mt-0">
            <BorrowedDataTable columns={columns} data={data} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

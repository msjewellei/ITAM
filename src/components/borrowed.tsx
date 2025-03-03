import { BorrowedAsset, columns } from "./borrowedColumns";
import { BorrowedDataTable } from "./borrowedTable";
import { Dialog } from "./ui/dialog";

export default function Borrowed() {
  const data: BorrowedAsset[] = [
    {
      id: "9",
      userId: 9,
      userName: "Jewel Lei 9",
      assetId: 9,
      assetName: "Borrowed Asset 9",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "10",
      userId: 10,
      userName: "Jewel Lei 10",
      assetId: 10,
      assetName: "Borrowed Asset 10",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "4",
      userId: 4,
      userName: "Jewel Lei 4",
      assetId: 4,
      assetName: "Borrowed Asset 4",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "11",
      userId: 11,
      userName: "Jewel Lei 11",
      assetId: 11,
      assetName: "Borrowed Asset 11",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "3",
      userId: 3,
      userName: "Jewel Lei 3",
      assetId: 3,
      assetName: "Borrowed Asset 3",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "7",
      userId: 7,
      userName: "Jewel Lei 7",
      assetId: 7,
      assetName: "Borrowed Asset 7",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "1",
      userId: 1,
      userName: "Jewel Lei 1",
      assetId: 1,
      assetName: "Borrowed Asset 1",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },
    {
      id: "8",
      userId: 8,
      userName: "Jewel Lei 8",
      assetId: 8,
      assetName: "Borrowed Asset 8",
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
    {
      id: "5",
      userId: 5,
      userName: "Jewel Lei 5",
      assetId: 5,
      assetName: "Borrowed Asset 5",
      dateBorrowed: "02/24/2025",
      dueDate: "N/A",
      returnDate: "N/A",
      duration: "100 days",
      condition: "Good",
      remarks: "None",
    },{
      id: "6",
      userId: 6,
      userName: "Jewel Lei 6",
      assetId: 6,
      assetName: "Borrowed Asset 6",
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
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Borrowed Assets</p>
          <div className="flex-1 min-h-0">
            <BorrowedDataTable columns={columns} data={data} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

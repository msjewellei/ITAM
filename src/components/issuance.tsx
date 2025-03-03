import { columns, IssuanceAsset } from "./issuanceColumns";
import { IssuanceDataTable } from "./issuanceTable";
import { Dialog } from "./ui/dialog";

export default function Issuance() {
  const data: IssuanceAsset[] = [
    {
      id: "2",
      userId: 2,
      userName: "Jewel Lei 2",
      assetId: 2,
      assetName: "Issued Asset 2",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "1",
      userId: 1,
      userName: "Jewel Lei",
      assetId: 1,
      assetName: "Issued Asset 1",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "3",
      userId: 3,
      userName: "Jewel Lei 3",
      assetId: 3,
      assetName: "Issued Asset 3",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "4",
      userId: 4,
      userName: "Jewel Lei 4",
      assetId: 4,
      assetName: "Issued Asset 4",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "5",
      userId: 5,
      userName: "Jewel Lei 5",
      assetId: 5,
      assetName: "Issued Asset 5",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "7",
      userId: 7,
      userName: "Jewel Lei 7",
      assetId: 7,
      assetName: "Issued Asset 7",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "6",
      userId: 6,
      userName: "Jewel Lei 6",
      assetId: 6,
      assetName: "Issued Asset 6",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "9",
      userId: 9,
      userName: "Jewel Lei 9",
      assetId: 9,
      assetName: "Issued Asset 9",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "8",
      userId: 8,
      userName: "Jewel Lei 8",
      assetId: 8,
      assetName: "Issued Asset 8",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "11",
      userId: 11,
      userName: "Jewel Lei 11",
      assetId: 11,
      assetName: "Issued Asset 11",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
    {
      id: "10",
      userId: 10,
      userName: "Jewel Lei 10",
      assetId: 10,
      assetName: "Issued Asset 10",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
  ];

  return (
    <>
      <Dialog>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Issued Assets</p>
          <div className="flex-1 min-h-0">
            <IssuanceDataTable columns={columns} data={data} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

import { columns, IssuanceAsset } from "./issuanceColumns";
import { IssuanceDataTable } from "./issuanceTable";
import { Dialog } from "./ui/dialog";

export default function Issuance() {
  const data: IssuanceAsset[] = [
    {
      issuance_id: "1",
      user_id: 1,
      employee_name: "Jewel Lei 1",
      asset_id: 1,
      asset_name: "Issued Asset 1",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "2",
      user_id: 2,
      employee_name: "Jewel Lei 2",
      asset_id: 2,
      asset_name: "Issued Asset 2",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "3",
      user_id: 3,
      employee_name: "Jewel Lei 3",
      asset_id: 3,
      asset_name: "Issued Asset 3",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "4",
      user_id: 4,
      employee_name: "Jewel Lei 4",
      asset_id: 4,
      asset_name: "Issued Asset 4",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "5",
      user_id: 5,
      employee_name: "Jewel Lei 5",
      asset_id: 5,
      asset_name: "Issued Asset 5",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "6",
      user_id: 6,
      employee_name: "Jewel Lei 6",
      asset_id: 6,
      asset_name: "Issued Asset 6",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "7",
      user_id: 7,
      employee_name: "Jewel Lei 7",
      asset_id: 7,
      asset_name: "Issued Asset 7",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "8",
      user_id: 8,
      employee_name: "Jewel Lei 8",
      asset_id: 8,
      asset_name: "Issued Asset 8",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "9",
      user_id: 9,
      employee_name: "Jewel Lei 9",
      asset_id: 9,
      asset_name: "Issued Asset 9",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "10",
      user_id: 10,
      employee_name: "Jewel Lei 10",
      asset_id: 10,
      asset_name: "Issued Asset 10",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
    },
    {
      issuance_id: "11",
      user_id: 11,
      employee_name: "Jewel Lei 11",
      asset_id: 11,
      asset_name: "Issued Asset 11",
      issuance_date: "02/25/2025",
      status_id: 1,
      status_name: "Done",
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

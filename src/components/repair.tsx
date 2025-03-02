import { Dialog } from "@radix-ui/react-dialog";
import { columns, RepairAsset } from "./repairColumns";
import { RepairDataTable } from "./repairTable";

export default function Repair() {
  const data: RepairAsset[] = [
    {
      id: "1",
      userId: 1,
      userName: "Jewel Lei",
      assetId: 1,
      assetName: "Repair Asset 1",
      issue: "Secret",
      remarks: "Secret",
      dateReported: "02/24/2025",
      urgencyLevel: "Urgent",
      repairStartDate: "02/24/2025",
      repairCompletionDate: "N/A",
      status: "Ongoing",
      repairCost: 1000000,
    },
    {
      id: "3",
      userId: 3,
      userName: "Jewel Lei 3",
      assetId: 3,
      assetName: "Repair Asset 3",
      issue: "Secret",
      remarks: "Secret",
      dateReported: "02/24/2025",
      urgencyLevel: "Urgent",
      repairStartDate: "02/24/2025",
      repairCompletionDate: "N/A",
      status: "Ongoing",
      repairCost: 1000000,
    },
    {
      id: "2",
      userId: 2,
      userName: "Jewel Lei 2",
      assetId: 2,
      assetName: "Repair Asset 2",
      issue: "Secret",
      remarks: "Secret",
      dateReported: "02/24/2025",
      urgencyLevel: "Urgent",
      repairStartDate: "02/24/2025",
      repairCompletionDate: "N/A",
      status: "Ongoing",
      repairCost: 1000000,
    },
  ];

  return (
    <>
      <Dialog>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Repair Assets</p>
          <div className="container py-3 mt-0">
            <RepairDataTable columns={columns} data={data} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

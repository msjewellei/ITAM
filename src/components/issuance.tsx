import { columns, IssuanceAsset } from "./issuanceColumns";
import IssuanceForm from "./issuanceForm";
import { IssuanceDataTable } from "./issuanceTable";
import { Dialog } from "./ui/dialog";

export default function Issuance() {
  const data: IssuanceAsset[] = [
    {
      id: "2",
      userId: 1,
      userName: "Jewel Lei",
      assetId: 1,
      assetName: "Issued Asset 2",
      issuanceDate: "02/25/2025",
      status: "Done",
    },
  ];

  return (
    <>
      <Dialog>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Issued Assets</p>
          <div className="container py-3 mt-0">
            <IssuanceDataTable columns={columns} data={data} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

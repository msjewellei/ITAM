import { useIssuance } from "@/context/issuanceContext";
import { columns } from "./issuanceColumns";
import { IssuanceDataTable } from "./issuanceTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { IssuanceUpdate } from "./issuanceUpdate";

export default function Issuance() {
  const { issuance } = useIssuance();
  return (
    <>
      <Dialog>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Issued Assets</p>
          <div className="flex-1 min-h-0">
            <IssuanceDataTable columns={columns} data={issuance} />
          </div>
        </div>
        <DialogContent className="w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center">
              Update Repair Request
            </DialogTitle>
          </DialogHeader>
          <IssuanceUpdate />
        </DialogContent>
      </Dialog>
    </>
  );
}

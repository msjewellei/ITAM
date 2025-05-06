import { useIssuance } from "@/context/issuanceContext";
import { columns } from "./issuanceColumns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { IssuanceUpdate } from "./issuanceUpdate";
import { DataTable } from "./dataTable";

export default function Issuance() {
  const { issuance } = useIssuance();
  return (
    <>
      <Dialog>
        <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)]  pl-[calc(7rem+10px)] w-full max-w-full">
          <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] flex flex-col">
            <p className="font-medium text-lg mt-5 px-10">Issued Assets</p>
            <div className="flex-1 min-h-0">
              <DataTable
                columns={columns}
                data={issuance}
                showAddButton
                addButtonPath="/issuance/add"
                hiddenColumns={["remarks"]}
              />
            </div>
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

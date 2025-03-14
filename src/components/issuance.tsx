import { useIssuance } from "@/context/issuanceContext";
import { columns } from "./issuanceColumns";
import { IssuanceDataTable } from "./issuanceTable";
import { Dialog } from "./ui/dialog";

export default function Issuance() {
  const { issuance } = useIssuance();
  return (
    <>
        <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
          <p className="font-medium text-lg mt-5 px-10">Issued Assets</p>
          <div className="flex-1 min-h-0">
            <IssuanceDataTable columns={columns} data={issuance} />
          </div>
        </div>
    </>
  );
}

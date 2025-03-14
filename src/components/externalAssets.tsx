import { useAsset } from "@/context/assetContext";
import { columns } from "./externalAssetsColumns";
import { ExternalDataTable } from "./externalTable";

function External() {
  const {externalAssets} = useAsset();
  return (
    <>
      <div className="bg-white rounded-xl min-h-[calc(100vh-13.10rem)] max-h-[calc(100vh-13.10rem)] flex flex-col">
        <p className="font-medium text-lg px-10 pt-4">External Assets</p>
        <div className="flex-1 min-h-0">
          <ExternalDataTable columns={columns} data={externalAssets} />
        </div>
      </div>
    </>
  );
}

export default External;

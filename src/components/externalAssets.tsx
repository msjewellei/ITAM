import { ExternalAsset, columns } from "./externalAssetsColumns";
import { ExternalDataTable } from "./externalTable";

function External() {
  const data: ExternalAsset[] = [
    {
      id: "728ed52f",
      assetName: "External Asset 3",
      category: "External",
      subCategory: "Gantry Routers",
      type: "None",
      condition: "Good",
      location: "ISTI Dept",
      availabilityStatus: "Available",
      serialNumber: "728ed52f",
      specifications: "eme",
      amount: 7000,
      warrantyDuration: 2,
      warrantyDueDate: "02/24/2027",
      purchaseDate: "02/24/2025",
      aging: 0,
      notes: "eme",
    },
    {
      id: "728ed52g",
      assetName: "External Asset 1",
      category: "External",
      subCategory: "Gantry Routers",
      type: "None",
      condition: "Good",
      location: "ISTI Dept",
      availabilityStatus: "Available",
      serialNumber: "728ed52f",
      specifications: "eme",
      amount: 10000,
      warrantyDuration: 2,
      warrantyDueDate: "02/24/2027",
      purchaseDate: "02/24/2025",
      aging: 0,
      notes: "eme",
    },
    {
      id: "728ed52h",
      assetName: "External Asset 2",
      category: "External",
      subCategory: "Gantry Routers",
      type: "None",
      condition: "Good",
      location: "ISTI Dept",
      availabilityStatus: "Available",
      serialNumber: "728ed52f",
      specifications: "eme",
      amount: 7000,
      warrantyDuration: 2,
      warrantyDueDate: "02/24/2027",
      purchaseDate: "02/24/2025",
      aging: 0,
      notes: "eme",
    },
  ];
  return (
    <>
      <div className="bg-white rounded-xl">
        <p className="font-medium text-lg px-10 pt-4">External Assets</p>
        <div className="container py-2 mt-0">
          <ExternalDataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}

export default External;

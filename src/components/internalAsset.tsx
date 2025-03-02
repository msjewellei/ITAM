import { Asset, columns } from "./assetColumns";
import { AssetDataTable } from "./assetTable";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

function InternalAsset() {
  const data: Asset[] = [
    {
      id: "728ed52f",
      assetName: "Internal Asset 3",
      category: "Internal",
      subCategory: "Laptop",
      type: "None",
      condition: "Good",
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
      id: "728ed52f",
      assetName: "Internal Asset 3",
      category: "Internal",
      subCategory: "Laptop",
      type: "None",
      condition: "Good",
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
      <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] max-h-[calc(100vh-13.10rem)]">
        <Tabs defaultValue="laptop" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="laptop">LAPTOP</TabsTrigger>
            <TabsTrigger value="printer">PRINTER</TabsTrigger>
            <TabsTrigger value="access_point">ACCESS POINT</TabsTrigger>
            <TabsTrigger value="routers_and_switch">
              ROUTERS AND SWITCH
            </TabsTrigger>
            <TabsTrigger value="stocks">STOCKS</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="container mt-0">
          <AssetDataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
export default InternalAsset;

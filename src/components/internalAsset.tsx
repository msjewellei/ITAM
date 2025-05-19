import { useAsset } from "@/context/assetContext";
import { columns } from "./assetColumns";
import { DataTable } from "./dataTable";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useMisc } from "@/context/miscellaneousContext";
import { useState } from "react";

function InternalAsset() {
  const { assets } = useAsset();
  const { subcategory } = useMisc();
  const [activeTab, setActiveTab] = useState("1");

  return (
    assets && (
      <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] flex flex-col">
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <div className="w-full overflow-x-auto">
            <TabsList className="w-full whitespace-nowrap">
              {subcategory.map((category) => (
                <TabsTrigger
                  key={category.sub_category_id}
                  value={category.sub_category_id.toString()}
                  className="uppercase"
                >
                  {category.sub_category_name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {subcategory.map((category, index) => {
            const data = assets.filter(
              (asset) =>
                Number(asset.category_id) === 2 &&
                asset.sub_category_id == activeTab
            );

            return (
              <TabsContent
                key={category.sub_category_id}
                value={category.sub_category_id.toString()}
              >
                <DataTable
                  columns={columns}
                  data={data}
                  selectedTab={index}
                  hiddenColumns={["type_id", "warranty_duration", "asset_amount", "warranty_due_date", "purchase_date", "aging", "specifications", "notes", "insurance",]}
                  showDateFilter={true}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    )
  );
}
export default InternalAsset;

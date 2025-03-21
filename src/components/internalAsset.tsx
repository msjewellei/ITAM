import { useAsset } from "@/context/assetContext";
import { columns } from "./assetColumns";
import { AssetDataTable } from "./assetTable";
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
      <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] max-h-[calc(100vh-13.10rem)] flex flex-col">
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full">
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

          {subcategory.map((category, index) => {
            const data = assets.filter(
              (asset) =>
                Number(asset.category_id) === 2 &&
                asset.sub_category_id == activeTab
            );

            return (
              <TabsContent key={category.sub_category_id} value={category.sub_category_id.toString()}>
                <div className="flex-1 min-h-0">
                  <AssetDataTable 
                    columns={columns} 
                    data={data} 
                    isLastTab={index === subcategory.length - 1} 
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    )
  );
}
export default InternalAsset;

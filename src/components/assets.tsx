import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import InternalAsset from "./internalAsset";
import External from "./externalAssets";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { Toaster } from "./ui/sonner";
import { Link } from "react-router-dom";

export default function Assets() {
  return (
    <>
      <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)]  pl-[calc(7rem+10px)] w-full max-w-full">
        <Tabs defaultValue="Internal" className="">
          <div className="flex flex-wrap justify-between items-center gap-4 w-full">
            <TabsList className="rounded-lg min-w-[200px] flex-1 sm:flex-none sm:w-auto p-2">
              <TabsTrigger value="Internal" className="w-full">
                Internal
              </TabsTrigger>
              <TabsTrigger value="External" className="w-full">
                External
              </TabsTrigger>
            </TabsList>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    asChild
                    className="h-11 w-fit bg-[#233345] text-white flex items-center gap-2"
                  >
                    <Link to="/assets/add">
                      <Plus />
                      <p>Add Assets</p>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Assets</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TabsContent value="Internal">
            <InternalAsset />
          </TabsContent>
          <TabsContent value="External">
            <External />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </>
  );
}

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import InternalAsset from "./internalAsset";
import External from "./externalAssets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssetForm from "./assetForm.copy";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";
import { Link } from "react-router-dom";

export default function Assets() {
  return (
    <>
        <div className="flex flex-col ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] mr-[calc(2.5rem)] w-screen  mb-10">
          <Tabs defaultValue="Internal" className="">
            <div className="flex justify-between items-center w-full">
              <TabsList className="rounded-lg w-1/4 p-2">
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
                    <Button asChild className="justify-items-center h-11 w-fit bg-[#233345] text-white">
                      <Link to="/assets/add" >
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

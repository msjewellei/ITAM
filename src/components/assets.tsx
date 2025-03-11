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

export default function Assets() {
  return (
    <>
      <Dialog>
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
                    <DialogTrigger asChild>
                      <Button className="justify-items-center h-11 w-fit bg-[#233345] text-white">
                        <Plus />
                        <p>Add Assets</p>
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Assets</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DialogContent className="w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Add New Asset
                  </DialogTitle>
                </DialogHeader>
                <AssetForm />
              </DialogContent>
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
      </Dialog>
    </>
  );
}

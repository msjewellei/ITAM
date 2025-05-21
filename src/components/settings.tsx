import { useMisc } from "@/context/miscellaneousContext";
import { DataTable } from "./dataTable";
import { subcategoryColumns, typeColumns } from "./settingsColumn";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import CollapsiblePanel from "./collapsiblePanel";
import ImageManagementForm from "./imageManagementForm";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { SubForm } from "./subcategoryForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";
import { TypeForm } from "./typeForm";

function SettingsPage() {
  const { mappedtype } = useMisc();
  const { subcategory } = useMisc();
  const [openDialog, setOpenDialog] = useState<"subcategory" | "type" | null>(null);
  return (
    <Dialog>
        
         <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 space-y-4">
      <CollapsiblePanel title="Categories Management">
      <div className="flex justify-end mt-4 mr-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="text-[#233345] flex items-center gap-1 p-0 h-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setOpenDialog("subcategory")}>
              Subcategory
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog("type")}>
              Type
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={openDialog === "subcategory"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
            <DialogTitle className="text-center">Add New Subcategory</DialogTitle>
          <SubForm />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === "type"} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
        <DialogTitle className="text-center">Add New Type</DialogTitle>
          <TypeForm/>
        </DialogContent>
      </Dialog>
          <div className="flex flex-row justify-between mt-4">
            <DataTable
              columns={subcategoryColumns}
              data={subcategory}
              width="45%"
              showDateFilter={false}
            />
            <DataTable
              columns={typeColumns}
              data={mappedtype}
              width="45%"
              showDateFilter={false}
            />
          </div>
        </CollapsiblePanel>

        <CollapsiblePanel title="Image Management">
          <ImageManagementForm />
        </CollapsiblePanel>
      </div>
    </Dialog>
  );
}

export default SettingsPage;

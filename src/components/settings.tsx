import { useMisc } from "@/context/miscellaneousContext";
import { DataTable } from "./dataTable";
import {
  subcategoryColumns,
  typeColumns,
  categoryColumns, // 👈 make sure this exists
} from "./settingsColumn";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import CollapsiblePanel from "./collapsiblePanel";
import ImageManagementForm from "./imageManagementForm";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { SubForm } from "./subcategoryForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { TypeForm } from "./typeForm";
import { CategoryForm } from "./categoryform";

function SettingsPage() {
  const { mappedtype, subcategory, category } = useMisc(); // 👈 added category
  const [openDialog, setOpenDialog] = useState<
    "category" | "subcategory" | "type" | null
  >(null);

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
                <DropdownMenuItem onSelect={() => setOpenDialog("category")}>
                  Category
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setOpenDialog("subcategory")}>
                  Subcategory
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setOpenDialog("type")}>
                  Type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Dialog
            open={openDialog === "category"}
            onOpenChange={() => setOpenDialog(null)}
          >
            <DialogContent>
              <DialogTitle className="text-center">
                Add New Category
              </DialogTitle>
              <CategoryForm />
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDialog === "subcategory"}
            onOpenChange={() => setOpenDialog(null)}
          >
            <DialogContent>
              <DialogTitle className="text-center">
                Add New Subcategory
              </DialogTitle>
              <SubForm />
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDialog === "type"}
            onOpenChange={() => setOpenDialog(null)}
          >
            <DialogContent>
              <DialogTitle className="text-center">Add New Type</DialogTitle>
              <TypeForm />
            </DialogContent>
          </Dialog>

          {/* All Tables in One Row (Each ≈ 30%) */}
          <div className="flex flex-row justify-between mt-6 gap-4 w-[100%]">
            <div className="w-[45%]">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Categories
              </h3>
              <DataTable
                columns={categoryColumns}
                data={category}
                width="100%"
                showDateFilter={false}
              />
            </div>

            <div className="w-[45%]">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Subcategories
              </h3>
              <DataTable
                columns={subcategoryColumns}
                data={subcategory}
                width="100%"
                showDateFilter={false}
              />
            </div>

            <div className="w-[45%]">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Types
              </h3>
              <DataTable
                columns={typeColumns}
                data={mappedtype}
                width="100%"
                showDateFilter={false}
              />
            </div>
          </div>
        </CollapsiblePanel>

      </div>
    </Dialog>
  );
}

export default SettingsPage;

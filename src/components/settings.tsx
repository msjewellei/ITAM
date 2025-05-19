import { useMisc } from "@/context/miscellaneousContext";
import { DataTable } from "./dataTable";
import { subcategoryColumns, typeColumns } from "./settingsColumn";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

function SettingsPage() {
  const { mappedtype } = useMisc();
  const { subcategory } = useMisc();
  return (
    <div className="ml-[calc(7rem+10px)] mt-[calc(1.5rem+10px)] w-screen mr-10 mb-10 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] bg-white rounded-xl">
      <p className="font-medium text-lg mt-5 px-10">Categories Management</p>

      <div className="flex justify-end px-10 mt-4">
        <Button
          asChild
          className="h-11 w-fit bg-[#233345] text-white flex items-center gap-2 px-4 rounded"
        >
          <Link
            to="/settings/categories/add"
            className="flex items-center gap-2"
          >
            <Plus />
            <p>Add Category</p>
          </Link>
        </Button>
      </div>
      <div className="flex flex-row justify-between">
        <DataTable
          columns={subcategoryColumns}
          data={subcategory}
          width="40%"
          showDateFilter={false}
        />
        <DataTable
          columns={typeColumns}
          data={mappedtype}
          width="40%"
          showDateFilter={false}
        />
      </div>
    </div>
  );
}

export default SettingsPage;

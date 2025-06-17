import { columns } from "./repairColumns";
import { useRepair } from "@/context/repairContext";
import { Dialog } from "./ui/dialog";
import { DataTable } from "./dataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/generalTabs";

export default function Repair() {
  const { repair, completedRepairs } = useRepair();

  return (
    <>
      <Dialog>
        <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)]  pl-[calc(7rem+10px)] w-full max-w-full">
          <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] flex flex-col">
            <p className="font-medium text-lg mt-5 px-10">Repair Assets</p>
            <Tabs
              defaultValue="All"
              className="p-4 max-w-full min-w-full mx-auto"
            >
              <TabsList className="w-full">
                <TabsTrigger value="All" className="w-1/2">
                  All
                </TabsTrigger>
                <TabsTrigger value="Completed" className="w-1/2">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="All">
                <DataTable
                  columns={columns}
                  data={repair}
                  showAddButton
                  addButtonPath="/repair/add"
                  hiddenColumns={[
                    "remarks",
                    "date_reported",
                    "repair_start_date",
                    "repair_completion_date",
                    "repair_cost",
                    "department_name",
                  ]}
                  showDateFilter={true}
                />
              </TabsContent>
              <TabsContent value="Completed">
                <DataTable
                  columns={columns}
                  data={completedRepairs}
                  showAddButton
                  addButtonPath="/borrowed/add"
                  hiddenColumns={[
                    "remarks",
                    "date_reported",
                    "repair_start_date",
                    "repair_completion_date",
                    "repair_cost",
                    "department_name",
                  ]}
                  showDateFilter={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Dialog>
    </>
  );
}

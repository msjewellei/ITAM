import { useBorrow } from "@/context/borrowContext";
import { columns } from "./borrowedColumns";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { DataTable } from "./dataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/generalTabs";
import { BorrowUpdate } from "./borrowUpdate";
import { useState } from "react";


export default function Borrowed() {
  const { borrow, returnedOnly } = useBorrow();
  const [open, setOpen] = useState(false);
  return (
    <Dialog>
      <div className="flex flex-col px-[2.5rem] pt-[calc(1.5rem+10px)]  pl-[calc(7rem+10px)] w-full max-w-full">
        <div className="bg-white rounded-xl min-h-[calc(100vh-14rem)] flex flex-col">
          <p className="font-medium text-lg mt-5 px-10">Borrowed Assets</p>
          <Tabs
            defaultValue="All"
            className="p-4 max-w-full min-w-full mx-auto"
          >
            <TabsList className="w-full">
              <TabsTrigger value="All" className="w-1/2">
                All
              </TabsTrigger>
              <TabsTrigger value="Returned" className="w-1/2">
                Returned
              </TabsTrigger>
            </TabsList>

            <TabsContent value="All">
              <DataTable
                columns={columns}
                data={borrow}
                showAddButton
                addButtonPath="/borrowed/add"
                hiddenColumns={[
                  "due_date",
                  "return_date",
                  "duration",
                  "remarks",
                ]}
                showDateFilter={true}
              />
            </TabsContent>
            <TabsContent value="Returned">
              <DataTable
                columns={columns}
                data={returnedOnly}
                showAddButton
                addButtonPath="/borrowed/add"
                hiddenColumns={[
                  "due_date",
                  "return_date",
                  "duration",
                  "remarks",
                ]}
                showDateFilter={true}
              />
            </TabsContent>
          </Tabs>
          <div className="flex-1 min-h-0"></div>
        </div>
      </div>
      <DialogContent>
        <DialogTitle className="text-center">Update Transaction</DialogTitle>
        <BorrowUpdate onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

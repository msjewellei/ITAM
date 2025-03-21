import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { conditionVariants } from "./badges";
import { Badge } from "./ui/badge";

export type BorrowedAsset = {
  borrow_transaction_id: string;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: string;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  date_borrowed: Date;
  due_date: Date;
  remarks: string;
  asset_condition_name: string;
  asset_condition_id: string;
  department_name: string;
  company_name: string;
  category_name: string;
  sub_category_name: string;
  return_date: Date;
  type_name: string;
};

export const columns: ColumnDef<BorrowedAsset>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="mr-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "asset_name",
    header: ({ column }) => {
      return (
        <div className="justify-start">
          <Button
            className="text-left w-full flex justify-start p-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Asset ID
            <ArrowUpDown className="ml-2 h-4 w-4 " />
          </Button>
        </div>
      );
    },
  },
  
  {
    accessorKey: "sub_category_name",
    header: "Category",
    accessorFn: (row) => row.type_id !== null ? row.type_name : row.sub_category_id !== null ? row.sub_category_name: row.category_id !== null ? row.category_name : "",
  },  
  {
    accessorKey: "employee_name",
    header: "Borrower Name"
  },
  {
    accessorKey: "department_name",
    header: "Department",
    accessorFn: (row) => row.department_name || row.company_name, 
  },  
  {
    accessorKey: "date_borrowed",
    header: "Date Borrowed",
    accessorFn: (row) => 
      row.date_borrowed 
        ? new Date(row.date_borrowed).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    accessorFn: (row) => 
      row.due_date 
        ? new Date(row.due_date).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
    accessorFn: (row) => 
      row.return_date 
        ? new Date(row.return_date).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "asset_condition_name",
    header: "Condition",
    cell: ({ row }) => {
      const { asset_condition_id, asset_condition_name } = row.original;
      const statusKey = `${asset_condition_id}`;
      const bgColor = conditionVariants[statusKey] || "bg-gray-200";
      return <Badge variant={"outline"} className={`${bgColor} px-2 py-1 rounded-md`}>{asset_condition_name}</Badge>;
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const borrow = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Borrow details</DropdownMenuItem>
            <DropdownMenuItem>Edit Borrow details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

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
  asset_condition_id: string;
  remarks: string;
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
            Asset Name
            <ArrowUpDown className="ml-2 h-4 w-4 " />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "employee_name",
    header: ({}) => {
      return <p className="">Borrower Name</p>;
    },
  },
  {
    accessorKey: "date_borrowed",
    header: "Date Borrowed",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "asset_condition_name",
    header: "Condition",
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(borrow.borrow_transaction_id)}
            >
              Copy Borrow ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Borrow details</DropdownMenuItem>
            <DropdownMenuItem>Edit Borrow details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

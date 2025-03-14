import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen } from "lucide-react";
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
import { DialogTrigger } from "./ui/dialog";

export type RepairAsset = {
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: string;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  issue: string;
  remarks: string;
  date_reported: Date;
  urgency_id: string;
  repair_start_date: Date;
  repair_completion_date: Date;
  status_id: string;
  repair_cost: number;
};

export const columns: ColumnDef<RepairAsset>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left w-full flex justify-start p-0"
        >
          Asset Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "employee_name",
    header: "Requester Name",
  },
  {
    accessorKey: "issue",
    header: "Issue",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "date_reported",
    header: "Date Reported",
  },
  {
    accessorKey: "urgency_level",
    header: "Urgency Level",
  },
  {
    accessorKey: "repair_start_date",
    header: "Start Date",
  },
  {
    accessorKey: "repair_completion_date",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.getValue("repair_completion_date") as string | null;

      return (
        <>
          <DialogTrigger>
            <div className="relative group flex items-center">
              <span>{endDate ?? "N/A"}</span>
              <SquarePen className="ml-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200" />
            </div>
          </DialogTrigger>
        </>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "repair_cost",
    header: () => <div className="text-left">Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("repair_cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Php",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const repair = row.original;

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
              onClick={() =>
                navigator.clipboard.writeText(repair.repair_request_id)
              }
            >
              Copy Repair ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Repair details</DropdownMenuItem>
            <DropdownMenuItem>Edit Repair details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

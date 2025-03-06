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
  repair_request_id: string;
  user_id: number;
  employee_name: string;
  asset_id: number;
  asset_name: string;
  issue: string;
  remarks: string;
  date_reported: string;
  urgency_id: number;
  urgency_level: string;
  repair_start_date: string;
  repair_completion_date: string;
  status_id: number;
  status_name: string;
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
    header: () => <div className="text-right">Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("repair_cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Php",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
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

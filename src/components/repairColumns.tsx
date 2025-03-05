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
  id: string;
  userId: number;
  requesterName: string;
  assetId: number;
  assetName: string;
  issue: string;
  remarks: string;
  dateReported: string;
  urgencyLevel: string;
  repairStartDate: string;
  repairCompletionDate: string;
  status: string;
  repairCost: number;
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
    accessorKey: "assetName",
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
    accessorKey: "requesterName",
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
    accessorKey: "dateReported",
    header: "Date Reported",
  },
  {
    accessorKey: "urgencyLevel",
    header: "Urgency Level",
  },
  {
    accessorKey: "repairStartDate",
    header: "Start Date",
  },
  {
    accessorKey: "repairCompletionDate",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.getValue("repairCompletionDate") as string | null;

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
    accessorKey: "repairCost",
    header: () => <div className="text-right">Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("repairCost"));
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
              onClick={() => navigator.clipboard.writeText(repair.id)}
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

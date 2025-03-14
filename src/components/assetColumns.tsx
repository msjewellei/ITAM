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

export type Asset = {
  asset_name: string;
  category_id: string;
  sub_category_id: string | null;
  type_id: string | null;
  location: string | null;
  availability_status_id: string;
  serial_number: string;
  specifications: string;
  asset_amount: number;
  warranty_duration: string;
  warranty_due_date: Date;
  purchase_date: Date;
  notes: string;
};

export const columns: ColumnDef<Asset>[] = [
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
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "asset_condition_name",
    header: "Condition",
  },
  {
    accessorKey: "availability_status",
    header: "Status",
  },
  {
    accessorKey: "serial_number",
    header: "Serial Number",
  },
  {
    accessorKey: "specifications",
    header: "Specifications",
  },
  {
    accessorKey: "asset_amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("asset_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Php",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "warranty_duration",
    header: "Warranty Duration",
  },
  {
    accessorKey: "warranty_due_date",
    header: "Warranty Due Date",
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
  },
  {
    accessorKey: "aging",
    header: "Aging",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const asset = row.original;

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
              onClick={() => navigator.clipboard.writeText(asset.asset_name)}
            >
              Copy Internal Asset ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Internal Asset details</DropdownMenuItem>
            <DropdownMenuItem>Edit Internal Asset details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

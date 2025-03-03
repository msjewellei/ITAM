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
  id: string;
  assetName: string;
  category: "External" | "Internal";
  subCategory:
    | "Gantry Routers"
    | "Laptop"
    | "Printers"
    | "Access Point"
    | "Routers and Switch"
    | "Stocks";
  type:
    | "None"
    | "Mouse"
    | "Keyboard"
    | "Printers"
    | "UPS Battery"
    | "Numeric Keypad";
  condition: "Good" | "Slightly Damaged" | "Damaged";
  availabilityStatus: "Available" | "Not Available";
  serialNumber: string;
  specifications: string;
  amount: number;
  warrantyDuration: number;
  warrantyDueDate: string;
  purchaseDate: string;
  aging: number;
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
    accessorKey: "assetName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "availabilityStatus",
    header: "Status",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "specifications",
    header: "Specifications",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Php",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "warrantyDuration",
    header: "Warranty Duration",
  },
  {
    accessorKey: "warrantyDueDate",
    header: "Warranty Due Date",
  },
  {
    accessorKey: "purchaseDate",
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
              onClick={() => navigator.clipboard.writeText(asset.id)}
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

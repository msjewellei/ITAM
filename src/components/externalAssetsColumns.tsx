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
import { Badge } from "./ui/badge";
import { conditionVariants, statusVariants } from "./badges";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export type ExternalAsset = {
  asset_name: string;
  category_id: string;
  sub_category_id: string | null;
  type_id: string | null;
  location: string | null;
  status_id: string;
  serial_number: string;
  specifications: string;
  asset_amount: number;
  warranty_duration: string;
  warranty_due_date: Date;
  purchase_date: Date;
  notes: string;
  asset_condition_id: string;
  asset_condition_name: string;
  status_name: string;
  file: string;
};

export const columns: ColumnDef<ExternalAsset>[] = [
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
    accessorKey: "file",
    header: "Picture",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const imageUrl = `http://localhost/itam_api/${row.original.file}`;

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <img
              src={imageUrl}
              className="max-w-16 max-h-16 object-cover cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </DialogTrigger>
          <DialogContent className="flex items-center justify-center">
            <img src={imageUrl} alt="Asset Enlarged" className="max-w-full max-h-[80vh] rounded-md" />
          </DialogContent>
        </Dialog>
      );
    },
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
    accessorKey: "serial_number",
    header: "Serial Number",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "asset_condition_name",
    header: "Condition",
    cell: ({ row }) => {
      const { asset_condition_id, asset_condition_name } = row.original;
      const statusKey = `${asset_condition_id}`;
      const bgColor = conditionVariants[statusKey] || "bg-gray-200";
      return (
        <Badge
          variant={"outline"}
          className={`${bgColor} px-2 py-1 rounded-md`}
        >
          {asset_condition_name}
        </Badge>
      );
    },
  },

  {
    accessorKey: "status_name",
    header: "Status",
    cell: ({ row }) => {
      const { status_id, status_name } = row.original;
      const statusKey = `${status_id}`;
      const bgColor = statusVariants[statusKey] || "bg-gray-200";
      return (
        <Badge
          variant={"outline"}
          className={`${bgColor} px-2 py-1 rounded-md`}
        >
          {status_name}
        </Badge>
      );
    },
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
      const external = row.original;

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
            <DropdownMenuItem>View External Asset details</DropdownMenuItem>
            <DropdownMenuItem>Edit External Asset details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

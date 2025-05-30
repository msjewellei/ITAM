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
import { conditionVariants, statusVariants } from "./badges";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { differenceInMonths } from "date-fns";
import ImageDialog from "./pictureDialog";

export type Asset = {
  type_name: string;
  asset_name: string;
  category_id: string;
  sub_category_id: string | null;
  type_id: string | null;
  location: string | null;
  status_id: string;
  status_name: string;
  serial_number: string;
  specifications: string;
  asset_amount: number;
  warranty_duration: string;
  warranty_due_date: Date;
  purchase_date: Date;
  notes: string;
  asset_condition_id: string;
  asset_condition_name: string;
  file: string;
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
    accessorKey: "file",
    header: "Picture",
    cell: ({ row }) => {
      const images = row.original.file
        ? row.original.file.split(",").map((img) => `http://localhost/itam_api/${img.trim()}`)
        : [];
  
      return <ImageDialog imageUrls={images} />;
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
          Asset ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "serial_number",
    header: "Serial No.",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "specifications",
    header: "Specifications",
  },
  {
    accessorKey: "type_id",
    header: "Type",
    cell: ({ row }) => row.original.type_name,
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
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
    accessorKey: "asset_value",
    header: "Asset Value",
    cell: ({ row }) => {
      const assetAmount = row.original.asset_amount;
      const aging = differenceInMonths(
        new Date(),
        new Date(row.original.purchase_date)
      );

      const rawValue = assetAmount - (assetAmount / 36) * aging;
      const assetValue = Math.max(rawValue, 0);

      const formattedAssetValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Php",
      }).format(assetValue);

      return <div>{formattedAssetValue}</div>;
    },
  },
  {
    accessorKey: "warranty_duration",
    header: "Warranty Duration",
  },
  {
    accessorKey: "warranty_due_date",
    header: "Warranty Due Date",
    accessorFn: (row) =>
      row.warranty_due_date
        ? new Date(row.warranty_due_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
    accessorFn: (row) =>
      row.purchase_date
        ? new Date(row.purchase_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
  },
  {
    accessorKey: "aging",
    header: "Aging (in months)",
    cell: ({ row }) => {
      const purchaseDate = new Date(row.original.purchase_date);
      const today = new Date();

      const agingInMonths = differenceInMonths(today, purchaseDate);

      return <div className="text-center">{agingInMonths}</div>;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "insurance",
    header: "Insurance",
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>View asset details</DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                to="/assets/update"
                state={{ assetId: asset.asset_id }}
              >
                Edit asset details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

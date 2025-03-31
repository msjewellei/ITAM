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
import { Badge } from "@/components/ui/badge"
import {statusVariants} from "@/components/badges"
import { useIssuance } from "@/context/issuanceContext";
import { useMisc } from "@/context/miscellaneousContext";
import { DialogTrigger } from "./ui/dialog";
import { useAsset } from "@/context/assetContext";

export type IssuanceAsset = {
  issuance_id: number;
  status_name: string;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: number;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: number;
  issuance_date: Date;
  status_id: string;
  company_name: string;
  department_name: string;
  category_name: string;
  sub_category_name: string;
  pullout_date: Date;
  type_name: string;
};



export const columns: ColumnDef<IssuanceAsset>[] = [
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
          Asset ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sub_category_name",
    header: "Category",
    accessorFn: (row) => 
      row.type_id ? row.type_name : 
      row.sub_category_id ? row.sub_category_name : 
      row.category_id ? row.category_name : "",
  },  
  {
    accessorKey: "employee_name",
    header: "Employee Name",
  },
  {
    accessorKey: "department_name",
    header: "Department",
    accessorFn: (row) => row.department_name || row.company_name, 
  },  
  {
    accessorKey: "issuance_date",
    header: "Issuance Date",
    accessorFn: (row) => 
      row.issuance_date 
        ? new Date(row.issuance_date).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
  },
  {
    accessorKey: "pullout_date",
    header: "Pullout Date",
    accessorFn: (row) => 
      row.pullout_date 
        ? new Date(row.pullout_date).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
    cell: ({ row }) => {
      const { setIssuanceID } = useIssuance();
      const { setUserID } = useMisc();
      const { setAssetID } = useAsset();
      const pullout = row.getValue("pullout_date") as string | null;
      return (
        <>
          <DialogTrigger
            onClick={() => {
              setIssuanceID(row.original.issuance_id);
              setUserID(row.original.user_id);
              setAssetID(row.original.asset_id);
            }}
          >
            <div className="relative group flex items-center cursor-pointer">
              <span>{pullout ?? "N/A"}</span>
              <SquarePen className="ml-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </DialogTrigger>
        </>
      );
    },        
},
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const issuance = row.original;

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
            <DropdownMenuItem>View Issuance details</DropdownMenuItem>
            <DropdownMenuItem>Edit Issuance details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

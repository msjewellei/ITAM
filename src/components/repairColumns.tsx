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
import { urgencyVariants, statusVariants } from "./badges";
import { Badge } from "./ui/badge";
import { useRepair } from "@/context/repairContext";
import { useMisc } from "@/context/miscellaneousContext";

export type RepairAsset = {
  repair_request_id: number;
  company_id: string;
  department_id: string;
  unit_id: string;
  user_id: number;
  category_id: string;
  sub_category_id: string;
  type_id: string;
  asset_id: string;
  issue: string;
  remarks: string;
  date_reported: Date;
  repair_start_date: Date;
  repair_completion_date: Date;
  repair_cost: number;
  status_id: string;
  status_name: string;
  urgency_id: string;
  urgency_level: string;
  department_name: string;
  company_name: string;
  sub_category_name: string;
  category_name: string;
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
          Asset ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sub_category_name",
    header: "Category",
    accessorFn: (row) => row.sub_category_name || row.category_name, 
  },  
  {
    accessorKey: "employee_name",
    header: "Requester Name",
  },
  {
    accessorKey: "department_name",
    header: "Department",
    accessorFn: (row) => row.department_name || row.company_name, 
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
    accessorFn: (row) => 
      row.date_reported 
        ? new Date(row.date_reported).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
  },
  {
    accessorKey: "urgency_level",
    header: "Urgency Level",
    cell: ({ row }) => {
      const { urgency_id, urgency_level } = row.original;
      const statusKey = `${urgency_id}`;
      const bgColor = urgencyVariants[statusKey] || "bg-gray-200";
      return <Badge variant={"outline"} className={`${bgColor} px-2 py-1 rounded-md`}>{urgency_level}</Badge>;
    },
  },
  {
    accessorKey: "repair_start_date",
    header: "Start Date",
    accessorFn: (row) => 
      row.repair_start_date 
        ? new Date(row.repair_start_date).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
  },
  {
    accessorKey: "repair_completion_date",
    header: "End Date",
    accessorFn: (row) => 
      row.repair_completion_date 
        ? new Date(row.repair_completion_date).toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "short", 
            day: "numeric" 
          }) 
        : "N/A",
    cell: ({ row }) => {
      const { setRepairID } = useRepair();
      const { setUserID } = useMisc();
      const endDate = row.getValue("repair_completion_date") as string | null;
      return (
        <>
          <DialogTrigger
            onClick={() => {
              console.log(row.original.repair_request_id);
              console.log(row.original.user_id);
              setRepairID(row.original.repair_request_id);
              setUserID(row.original.user_id);
            }}
          >
            <div className="relative group flex items-center cursor-pointer">
              <span>{endDate ?? "N/A"}</span>
              <SquarePen className="ml-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </DialogTrigger>
        </>
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
      return <Badge variant={"outline"} className={`${bgColor} px-2 py-1 rounded-md`}>{status_name}</Badge>;
    },
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
            
            <DropdownMenuSeparator />
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

import { ColumnDef } from "@tanstack/react-table";

export const typeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "classification",
    header: "Classification",
  },
  {
    accessorKey: "parent",
    header: "Parent",
  },
];

export const subcategoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.sub_category_name,
  },
  {
    accessorKey: "classification",
    header: "Classification",
    cell: () => "Subcategory",
  },
  {
    accessorKey: "category_name",
    header: "Parent",
    cell: ({ row }) => {
      console.log("Row data:", row.original);
      return row.original.category_name || "Missing";
    },
  },
];

export const categoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "category_name",
    header: "Name",
    cell: ({ row }) => row.original.category_name,
  },
  {
    accessorKey: "classification",
    header: "Classification",
    cell: () => "Category",
  },
   
];

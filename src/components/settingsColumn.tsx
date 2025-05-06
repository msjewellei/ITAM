import { ColumnDef } from "@tanstack/react-table";
import { DataTable }  from "./dataTable";

export const categoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description,
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => <div className="text-right">Edit</div>,
  },
];

// Dummy data
const categoryData = [
  { id: 1, name: "Electronics", description: "Devices and gadgets" },
  { id: 2, name: "Furniture", description: "Chairs, desks, etc." },
];

export default function CategoryTable() {
  return (
    <DataTable
      columns={categoryColumns}
      data={categoryData}
    />
  );
}

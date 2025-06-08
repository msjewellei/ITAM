import { CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Column {
  key: string;
  label: string;
  className?: string;
  alignRight?: boolean;
}

interface DashboardTableProps {
  title?: string;
  columns: Column[];
  data: Record<string, any>[];
}

export function DashboardTable({
  title,
  columns,
  data,
}: DashboardTableProps) {
  const defaultCellClass = `px-4 py-2`;

  return (
      <div className="mr-4 ml-4 mt-2 pb-5 pt-3">
      {title && (
        <CardHeader className="items-center text-center pb-2">
          <CardTitle className="w-full text-center">{title}</CardTitle>
        </CardHeader>
      )}
    <Table className=" w-full">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={`${defaultCellClass} ${col.className ?? ""} ${
                col.alignRight ? "text-right" : "text-left"
              }`}
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                className={`${defaultCellClass} ${
                  col.alignRight ? "text-right" : "text-left"
                }`}
              >
                {row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table></div>
  );
}

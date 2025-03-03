import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { format } from "date-fns";
import { Calendar as CalendarIcon, ListFilter, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import * as React from "react";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "./ui/dialog";
import BorrowForm from "./borrowForm";

interface BorrowedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function BorrowedDataTable<TData, TValue>({
  columns,
  data,
}: BorrowedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [] = React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="pl-10 pr-10 pb-10">
      <div className="flex justify-between">
        <div className="flex items-center py-4 justify-start">
          <Input
            placeholder="Search Borrower"
            value={
              (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="max-w-md min-w-sm"
          />
        </div>
        <div className="flex justify-end gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[30px] justify-center text-center font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="m-auto h-4 w-4 p-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[30px] justify-center text-center font-normal"
              >
                <ListFilter className="m-auto h-4 w-4 p-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[30px] justify-center text-center font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <Plus className="m-auto h-4 w-4 p-auto" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-medium">New Borrow Transaction</DialogTitle>
            </DialogHeader>
            <BorrowForm />
          </DialogContent>
        </div>
      </div>
      <div className="flex flex-col min-h-[calc(100vh-22rem)] max-h-[calc(100vh-22rem)] overflow-auto">
        <Table className="justify-start text-left">
          <TableHeader className="justify-start text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} justify-start text-left>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="justify-start text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-left">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

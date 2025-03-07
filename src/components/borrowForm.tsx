import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogFooter } from "./ui/dialog";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";

interface User {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
    department?: {
      id: number;
      name: string;
      unit?: {
        id: number;
        name: string;
      };
    };
  };
}

const formSchema = z.object({
  company_id: z.number().min(1),
  company_name: z.string().min(2).max(50),
  department_id: z.number().min(1),
  department_name: z.string().min(2).max(50),
  unit_id: z.number().min(1),
  unit_name: z.string().min(2).max(50),
  user_id: z.number().min(1),
  employee_name: z.string().min(2).max(50),
  category_id: z.number().min(1),
  category_name: z.string().min(2).max(50),
  sub_category_id: z.number().min(1),
  sub_category_name: z.string().min(2).max(50),
  type_id: z.number().min(1),
  type_name: z.string().min(2).max(50),
  asset_id: z.number().min(1),
  asset_name: z.string().min(2).max(50),
  date_borrowed: z.date(),
  due_date: z.date(),
  asset_condition_id: z.number().min(1),
  asset_condition_name: z.string().min(2).max(50),
  remarks: z.string().min(2).max(100),
});

function BorrowForm() {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [company, setCompany] = useState<{ id: number; name: string }[]>([]);
  const [department, setDepartment] = useState<
  { id: number; name: string; unit?: { id: number; name: string }[] }[]
>([]);

  const [unit, setUnit] = useState<{ id: number; name: string }[]>([]);
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [departmentID, setDepartmentID] = useState<string | null>(null);
  const [unitID, setUnitID] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const response = await axios.get("/usersData.json");
      const uniqueCompanies: { id: number; name: string }[] = Array.from(
        new Map<number, { id: number; name: string }>(
          response.data.user.map((user: User) => [
            user.company.id,
            { id: user.company.id, name: user.company.name },
          ])
        ).values()
      );

      setCompany(uniqueCompanies);
    };

    fetchCompany();
  }, []);

  useEffect(() => {
    const setup = async () => {
      const response = await axios.get("/usersData.json");
      setUsers(response.data.user);
    };
    setup();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get("/usersData.json");
  
      const departmentMap = new Map<number, { id: number; name: string; unit: { id: number; name: string }[] }>();
  
      response.data.user
        .filter((user: User) => user.company.id === Number(companyID) && user.company.department)
        .forEach((user: User) => {
          const dept = user.company.department!;
          const unit = user.company.department?.unit;
  
          if (!departmentMap.has(dept.id)) {
            departmentMap.set(dept.id, {
              id: dept.id,
              name: dept.name,
              unit: [],
            });
          }
  
          if (unit) {
            const deptEntry = departmentMap.get(dept.id)!;
            if (!deptEntry.unit.some((u) => u.id === unit.id)) {
              deptEntry.unit.push({ id: unit.id, name: unit.name });
            }
          }
        });
  
      const uniqueDepartments = Array.from(departmentMap.values());
  
      console.log("Processed Departments with Units:", uniqueDepartments);
      setDepartment(uniqueDepartments);
    };
  
    if (companyID) {
      fetchDepartments();
    }
  }, [companyID]);
  

  useEffect(() => {
    const fetchUnits = async () => {
      const response = await axios.get("/usersData.json");
  
      const units = response.data.user
        .filter(
          (user: User) =>
            user.company.id === Number(companyID) &&
            user.company.department?.id === Number(departmentID) &&
            user.company.department.unit
        )
        .map((user: { company: { department: any; }; }) => user.company.department!.unit!)
        .filter(
          (unit: { id: any; }, index: any, self: any[]) =>
            unit && self.findIndex((u: { id: any; }) => u?.id === unit.id) === index
        );
  
      if (units.length > 0) {
        setUnit(units);
      } else {
        setUnit([]); // Ensures the dropdown won't have stale data
      }
    };
  
    if (companyID && departmentID) {
      fetchUnits();
    } else {
      setUnit([]); // Reset unit if no department is selected
    }
  }, [companyID, departmentID]);
  

  const filteredUser = useMemo(() => {
    let currentUsers = users;
    if (companyID) {
      currentUsers = currentUsers.filter(
        (user) => user.company.id === Number(companyID)
      );
    }
    if (departmentID) {
      currentUsers = currentUsers.filter(
        (user) => user.company.department?.name === departmentID
      );
    }
    if (unitID) {
      currentUsers = currentUsers.filter(
        (user) => user.company.department?.unit?.name === unitID
      );
    }

    return currentUsers;
  }, [companyID, departmentID, unitID, users]);

    const userCompany = useMemo(() => {
      return company.find((company) => company.id === Number(companyID)) || null;
    }, [companyID, company]);
  
    const userDepartment = useMemo(() => {
      if (!departmentID) return [];
      return users
        .filter((user) => user.company.department)
        .map((user) => user.company.department!)
        .filter(
          (department) => department && department.id === Number(departmentID)
        );
    }, [departmentID]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_id: undefined,
      company_name: "",
      department_id: undefined,
      department_name: "",
      unit_id: undefined,
      unit_name: "",
      user_id: undefined,
      employee_name: "",
      category_id: undefined,
      category_name: "",
      sub_category_id: undefined,
      sub_category_name: "",
      type_id: undefined,
      type_name: "",
      asset_id: undefined,
      asset_name: "",
      date_borrowed: undefined,
      due_date: undefined,
      asset_condition_id: undefined,
      asset_condition_name: "",
      remarks: "",
    },
  });



  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="pl-5 pr-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(
                          value === "reset" ? undefined : Number(value)
                        );
                        setCompanyID(value === "reset" ? null : value);
                      }}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="reset">Select a Company</SelectItem>
                        {company
                          .filter((company) => company.id && company.name)
                          .map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {companyID && (
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Department Dropdown (Only appears if the company has departments) */}
    {department.length > 0 && (
      <div
        className={`transition-all duration-200 ${
          unit.length > 0 ? "sm:w-1/2" : "sm:w-full"
        }`}
      >
        <FormField
          control={form.control}
          name="department_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setDepartmentID(value);
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {department.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    )}

    {/* Unit Dropdown */}
    {unit.length > 0 && (
      <div className={`${department.length > 0 ? "sm:w-1/2" : "sm:w-full"}`}>
        <FormField
          control={form.control}
          name="unit_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setUnitID(value);
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unit.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    )}
  </div>
)}

          <div className="w-full">
            <FormField
              control={form.control}
              name="employee_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="name" placeholder="Borrower Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Internal">Internal</SelectItem>
                        <SelectItem value="External">External</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="sub_category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sub Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Printer">Printer</SelectItem>
                          <SelectItem value="Access Point">
                            Access Point
                          </SelectItem>
                          <SelectItem value="Routers and Switch">
                            Routers and Switch
                          </SelectItem>
                          <SelectItem value="Stocks">Stocks</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="type_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Type 1">Type 1</SelectItem>
                          <SelectItem value="Type 2">Type 2</SelectItem>
                          <SelectItem value="Type 3">Type 3</SelectItem>
                          <SelectItem value="Type 4">Type 4</SelectItem>
                          <SelectItem value="Type 5">Type 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="asset_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Asset Name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asset 1">Asset 1</SelectItem>
                        <SelectItem value="Asset 2">Asset 2</SelectItem>
                        <SelectItem value="Asset 3">Asset 3</SelectItem>
                        <SelectItem value="Asset 4">Asset 4</SelectItem>
                        <SelectItem value="Asset 5">Asset 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="date_borrowed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-[#737373]">
                                Date Borrowed
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-[#737373]">Due Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="asset_condition_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                        <SelectItem value="Defective">Defective</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your remarks here."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export default BorrowForm;

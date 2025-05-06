import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { CalendarIcon, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMisc } from "@/context/miscellaneousContext";
import { useAsset } from "@/context/assetContext";
import { Link, useNavigate, } from "react-router-dom";
import { useBorrow } from "@/context/borrowContext";
import { toast } from "sonner";

const formSchema = z.object({
  company_id: z.string(),
  department_id: z.string().optional(),
  unit_id: z.string().optional(),
  user_id: z.string(),
  category_id: z.string(),
  sub_category_id: z.string().optional(),
  type_id: z.string().optional(),
  asset_id: z.string(),
  date_borrowed: z.date(),
  due_date: z.date(),
  duration: z.number(),
  asset_condition_id: z.string(),
  remarks: z.string().min(2).max(100),
});

function BorrowForm() {
  const navigate = useNavigate();
  const {
    user,
    company,
    department,
    unit,
    filteredDepartments,
    filteredUnits,
    setCompanyID,
    setDepartmentID,
    setUnitID,
    category,
    subcategory,
    type,
    filteredUsers,
    setUserID,
    filteredSubcategories,
    unitID,
    departmentID,
  } = useMisc();
  const {
    filteredInternalAssets,
    setCategoryID,
    setSubCategoryID,
    setTypeID,
    categoryID,
    subCategoryID,
  } = useAsset();
  const { insertTransaction } = useBorrow();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_id: "",
      department_id: "",
      unit_id: "",
      user_id: "",
      category_id: "",
      sub_category_id: "",
      type_id: "",
      asset_id: "",
      date_borrowed: new Date(),
      due_date: new Date(),
      duration: 0,
      asset_condition_id: "",
      remarks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const asset = filteredInternalAssets.find(
      (cat) => cat.asset_name === values.asset_id
    );
    values.asset_id = asset.asset_id
    values.asset_condition_id = asset.asset_condition_id

    values.user_id = filteredUsers.find(
      (cat) => `${cat.first_name} ${cat.last_name}` === values.user_id
    )?.user_id;

    values.company_id = company.find(
      (cat) => cat.name === values.company_id
    )?.company_id;

    values.department_id = filteredDepartments.find(
      (cat) => cat.name === values.department_id
    )?.department_id;

    values.unit_id = filteredUnits.find(
      (cat) => cat.name === values.unit_id
    )?.unit_id;

    values.category_id = category.find(
      (cat) => cat.category_name === values.category_id
    )?.category_id;

    values.sub_category_id = filteredSubcategories.find(
      (cat) => cat.sub_category_name === values.sub_category_id
    )?.sub_category_id;
    values.sub_category_id = filteredSubcategories.find(
      (cat) => cat.sub_category_name === values.sub_category_id
    )?.sub_category_id;

    values.type_id = type.find(
      (cat) => cat.type_name === values.type_id
    )?.type_id;



    if (!unitID) {
      values.unit_id = "";
    }

    if (!departmentID) {
      values.department_id = "";
    }

    try {
      const response = await insertTransaction(values);
    
      if (response && Object.keys(response).length > 0) {
        toast.success("Borrow transaction successfully added!");
        navigate("/Borrowed");
      } else {
        toast.error(`Failed to add borrow transaction: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }

  }

  return (
    <div className="flex flex-col ml-[calc(7rem+10px)] mt-15px mr-[calc(2.5rem)] h-full">
      <div className="flex flex-row items-center justify-between">
        <p className="pl-1 pt-5 mb-4 text-lg">New Borrow Transaction</p>
        <Link to="/borrowed">
          <Button variant="link">
            <ChevronLeft />
            <p>Back</p>
          </Button>
        </Link>
      </div>
      <div className="w-[calc(100vw-10rem)] rounded-xl bg-white min-h-[calc(100vh-13.10rem)] h-auto p-5 mb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="company_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setCompanyID(() => {
                              const item = company.find(
                                (c) => c.name === value
                              );

                              if (item) {
                                return Number(item.company_id);
                              }
                              return null;
                            });
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Company" />
                          </SelectTrigger>
                          <SelectContent>
                            {company.map((comp) => (
                              <SelectItem
                                key={comp.name}
                                value={comp.name}
                              >
                                {comp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {filteredDepartments.length > 0 && (
                  <FormField
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department/Business Unit</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setDepartmentID(() => {
                                const dept = department.find(
                                  (dep) => dep.name === value
                                );
                                if (dept) {
                                  return Number(dept.department_id);
                                }
                                return null;
                              });
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Department/Business Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredDepartments.map((dept) => (
                                <SelectItem key={dept.name} value={dept.name}>
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
                )}

                {filteredUnits.length > 0 && (
                  <FormField
                    control={form.control}
                    name="unit_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setUnitID(() => {
                                const uni = unit.find(
                                  (un) => un.name === value
                                );

                                if (uni) {
                                  return Number(uni.unit_id);
                                }
                                return null;
                              });
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredUnits.map((un) => (
                                <SelectItem key={un.name} value={un.name}>
                                  {un.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borrower Name</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setUserID(() => {
                              const users = user.find(
                                (u) =>
                                  `${u.first_name} ${u.last_name}` === value
                              );

                              if (users) {
                                return Number(users.user_id);
                              }
                              return null;
                            });
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredUsers.map((users) => (
                              <SelectItem
                                key={users.user_id}
                                value={`${users.first_name} ${users.last_name}`}
                              >
                                {`${users.first_name} ${users.last_name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setCategoryID(() => {
                              const item = category.find(
                                (c) => c.category_name === value
                              );

                              if (item) {
                                return Number(item.category_id);
                              }
                              return null;
                            });
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {category.map((cat) => (
                              <SelectItem
                                key={cat.category_name}
                                value={cat.category_name}
                              >
                                {cat.category_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {categoryID === 2 && (
                  <FormField
                    control={form.control}
                    name="sub_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSubCategoryID(() => {
                                const sub = subcategory.find(
                                  (c) => c.sub_category_name === value
                                );

                                if (sub) {
                                  return Number(sub.sub_category_id);
                                }
                                return null;
                              });
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sub Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {subcategory.map((sub) => (
                                <SelectItem
                                  key={sub.sub_category_name}
                                  value={sub.sub_category_name}
                                >
                                  {sub.sub_category_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {subCategoryID === 5 && categoryID === 2 && (
                  <FormField
                    control={form.control}
                    name="type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setTypeID(() => {
                                const ty = type.find(
                                  (typ) => typ.type_name === value
                                );
                                if (ty) {
                                  return Number(ty.type_id);
                                }
                                return null;
                              });
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {type.map((type) => (
                                <SelectItem
                                  key={type.type_name}
                                  value={type.type_name}
                                >
                                  {type.type_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {filteredInternalAssets.length > 0 && (
                  <FormField
                    control={form.control}
                    name="asset_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset ID</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Asset ID" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredInternalAssets.map((asset) => (
                                <SelectItem
                                  key={asset.asset_name}
                                  value={asset.asset_name}
                                >
                                  {asset.asset_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="date_borrowed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Borrowed</FormLabel>
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
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
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
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
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
              <div className="col-span-2 flex justify-end align-end">
                <Button className="w-fit text-sm sm:text-base" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default BorrowForm;

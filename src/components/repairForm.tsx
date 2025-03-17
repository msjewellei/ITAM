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
import { DialogFooter } from "./ui/dialog";
import { useAsset } from "@/context/assetContext";
import { useMisc } from "@/context/miscellaneousContext";
import { Link } from "react-router-dom";
import { useRepair } from "@/context/repairContext";

const formSchema = z.object({
  company_id: z.string(),
  department_id: z.string(),
  unit_id: z.string(),
  user_id: z.string(),
  category_id: z.string(),
  sub_category_id: z.string(),
  type_id: z.string(),
  asset_id: z.string(),
  issue: z.string(),
  remarks: z.string(),
  date_reported: z.date(),
  urgency_id: z.string(),
  repair_start_date: z.date(),
  repair_completion_date: z.date(),
  status_id: z.string(),
  repair_cost: z.number(),
});

function RepairForm() {
  const {
    category,
    subcategory,
    type,
    repairUrgency,
    status,
    company,
    department,
    unit,
    filteredDepartments,
    filteredUnits,
    setCompanyID,
    setDepartmentID,
    setUnitID,
    filteredUsers,
    setUserID,
    user,
  } = useMisc();
  const {
    setCategoryID,
    setSubCategoryID,
    setTypeID,
    filteredAssets,
    categoryID,
    subCategoryID,
  } = useAsset();
  const { insertRepair } = useRepair();
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
      issue: "",
      remarks: "",
      date_reported: new Date(),
      urgency_id: "",
      repair_start_date: new Date(),
      repair_completion_date: new Date(),
      status_id: "",
      repair_cost: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.asset_id = filteredAssets.find(
      (cat) => cat.asset_name === values.asset_id
    )?.asset_id;

    values.user_id = filteredUsers.find(
      (cat) => `${cat.first_name} ${cat.last_name}` === values.user_id
    )?.user_id;

    values.urgency_id = repairUrgency.find(
      (cat) => cat.urgency_level === values.urgency_id
    )?.urgency_id;

    values.status_id = status.find(
      (cat) => cat.status_name === values.status_id
    )?.status_id;

    values.company_id = company.find(
      (cat) => cat.name === values.company_id
    )?.company_id;

    values.department_id = filteredDepartments.find(
      (cat) => cat.name === values.department_id
    )?.department_id;

    values.unit_id = filteredUnits.find(
      (cat) => cat.name === values.unit_id
    )?.unit_id;

    const response = await insertRepair(values);
    window.location.reload();

  }

  return (
    <div className="flex flex-col ml-[calc(7rem+10px)] mt-15px mr-[calc(2.5rem)] h-full">
      <div className="flex flex-row items-center justify-between">
        <p className="pl-1 pt-5 mb-4 text-lg">New Repair Request</p>
        <Link to="/repair">
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
                                key={comp.company_id}
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
                        <FormLabel>Unit</FormLabel>
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
                              <SelectValue placeholder="Select Unit" />
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
                      <FormLabel>Requester Name</FormLabel>
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
                            <SelectValue placeholder="Select Requester" />
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
                            <SelectValue placeholder="Category" />
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
                {categoryID === 2 && subCategoryID === 5 && (
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
                <FormField
                  control={form.control}
                  name="asset_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Asset Name" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredAssets.map((asset) => (
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
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="issue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue</FormLabel>
                      <FormControl>
                        <Input type="issue" placeholder="Issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_reported"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Reported</FormLabel>
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
                                  Date Reported
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
                  name="urgency_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                          <SelectContent>
                            {repairUrgency.map((ru) => (
                              <SelectItem
                                key={ru.urgency_level}
                                value={ru.urgency_level}
                              >
                                {ru.urgency_level}
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
                  name="repair_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
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
                                  Repair Start Date
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
                  name="status_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((st) => (
                              <SelectItem
                                key={st.status_name}
                                value={st.status_name}
                              >
                                {st.status_name}
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
                  name="repair_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repair Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Repair Cost"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
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

export default RepairForm;

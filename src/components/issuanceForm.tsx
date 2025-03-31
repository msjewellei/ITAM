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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMisc } from "@/context/miscellaneousContext";
import { useAsset } from "@/context/assetContext";
import { useIssuance } from "@/context/issuanceContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"


const formSchema = z.object({
  company_id: z.string(),
  department_id: z.string(),
  unit_id: z.string(),
  user_id: z.string(),
  category_id: z.string(),
  sub_category_id: z.string(),
  type_id: z.string(),
  asset_id: z.string(),
  issuance_date: z.date(),
  status_id: z.string(),
});

function IssuanceForm() {
  const navigate = useNavigate();
  const {
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
    status,
    filteredUsers,
    setUserID,
    user,
  } = useMisc();
  const {
    filteredAssets,
    setCategoryID,
    setSubCategoryID,
    setTypeID,
    categoryID,
    subCategoryID,
  } = useAsset();

  const { insertIssuance } = useIssuance();
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
      issuance_date: new Date(),
      status_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.asset_id = filteredAssets.find(
      (cat) => cat.asset_name === values.asset_id
    )?.asset_id;

    values.company_id = company.find(
      (cat) => cat.name === values.company_id
    )?.company_id;

    values.department_id = filteredDepartments.find(
      (cat) => cat.name === values.department_id
    )?.department_id;

    values.unit_id = filteredUnits.find(
      (cat) => cat.name === values.unit_id
    )?.unit_id;

    values.user_id = filteredUsers.find(
      (cat) => `${cat.first_name} ${cat.last_name}` === values.user_id
    )?.user_id;

    values.status_id = status.find(
      (cat) => cat.status_name === values.status_id
    )?.status_id;

    try {
      const response = await insertIssuance(values);
    
      if (response && Object.keys(response).length > 0) {
        toast.success("Asset issuance recorded successfully!");
        navigate("/issuance");
      } else {
        toast.error(`Failed to record asset issuance: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
        
  }


  return (
    <div className="flex flex-col ml-[calc(7rem+10px)] mt-15px mr-[calc(2.5rem)] ">
      <div className="flex flex-row items-center justify-between">
        <p className="pl-1 pt-5 mb-4 text-lg">New Issuance Transaction</p>
        <Link to="/issuance">
          <Button variant="link">
            <ChevronLeft />
            <p>Back</p>
          </Button>
        </Link>
      </div>
      <div className="w-[calc(100vw-10rem)] rounded-xl bg-white min-h-[calc(100vh-13.10rem)] h-auto p-5 mb-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full">
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
                                <SelectValue placeholder="Select Department" />
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

                  
                </div>

                <div className="flex flex-col gap-4"><FormField
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

                  <FormField
                    control={form.control}
                    name="issuance_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuance Date</FormLabel>
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
                                    Issuance Date
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                <div className="col-span-2 flex justify-end align-end">
                  <Button className="w-fit text-sm sm:text-base" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default IssuanceForm;

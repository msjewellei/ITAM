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
import { toast } from "sonner";
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
import { Link, useNavigate } from "react-router-dom";
import { useAsset } from "@/context/assetContext";

const formSchema = z.object({
  asset_name: z.string().min(2).max(50),
  category_id: z.string().min(2).max(50),
  sub_category_id: z.string().optional(),
  type_id: z.string().optional(),
  location: z.string().optional(),
  // asset_condition_id: z.string(),
  availability_status_id: z.string().min(2).max(50),
  serial_number: z.string().min(2).max(50),
  specifications: z.string().min(2).max(100),
  asset_amount: z.coerce.number(),
  warranty_duration: z.string().min(2).max(50),
  warranty_due_date: z.date(),
  purchase_date: z.date(),
  // aging: z.number(),
  notes: z.string().min(2).max(100),
});

function AssetForm() {
  const navigate = useNavigate();

  const {
    category,
    subcategory,
    type,
    filteredSubcategories,
    setCategoryID,
    setSubCategoryID,
    subCategoryID,
    status,
    categoryID,
  } = useMisc();

  const { insertAsset } = useAsset();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_name: "",
      category_id: "",
      sub_category_id: "",
      type_id: "",
      location: "",
      // asset_condition_id: "",
      availability_status_id: "",
      serial_number: "",
      specifications: "",
      asset_amount: 0,
      warranty_duration: "",
      warranty_due_date: new Date(),
      purchase_date: new Date(),
      // aging: 0,
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.category_id = category.find(
      (cat) => cat.category_name === values.category_id
    )?.category_id;
    if (values.sub_category_id) {
      values.sub_category_id = subcategory.find(
        (sub) => sub.sub_category_name === values.sub_category_id
      )?.sub_category_id;
    }
    if (values.type_id) {
      values.type_id = type.find(
        (ty) => ty.type_name === values.type_id
      )?.type_id;
    }
    if (categoryID !== 2) {
      values.sub_category_id = "";
    }
    if (values.sub_category_id === "") {
      values.type_id = "";
    }
    const response = await insertAsset(values);
    console.log(response);
    navigate(-1);
    window.location.reload();
  }

  return (
    <div className="flex flex-col ml-[calc(7rem+10px)] mt-15px mr-[calc(2.5rem)] h-full ">
      <div className="flex flex-row items-center justify-between">
        <p className="pl-1 pt-5 mb-4 text-lg">New Asset</p>
        <Link to="/assets">
          <Button variant="link">
            <ChevronLeft />
            <p>Back</p>
          </Button>
        </Link>
      </div>
      <div className="w-[calc(100vw-10rem)] rounded-xl bg-white min-h-[calc(100vh-13.10rem)] h-auto p-5 mb-5">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Only for debugging, remove later
              console.log("Form submission triggered");
              form.handleSubmit(onSubmit)();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="asset_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="text-sm sm:text-base"
                          placeholder="Ex. Laptop-001"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serial_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Serial Number"
                          className="text-sm sm:text-base"
                          {...field}
                        />
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

                              console.log(item);

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
                {filteredSubcategories.length > 0 && (
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

                                console.log(sub);

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
                            onValueChange={field.onChange}
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

                {categoryID === 1 && (
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Location"
                            {...field}
                            className="text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specifications</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="text-sm sm:text-base"
                          placeholder="Ex. RAM - 2GB"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="asset_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="availability_status_id"
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
                            {status.map((stat) => (
                              <SelectItem
                                key={stat.status_name}
                                value={stat.status_name}
                              >
                                {stat.status_name}
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
                  name="warranty_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Duration</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="text-sm sm:text-base"
                          placeholder="Ex. 2 years"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warranty_due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Due Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal text-sm ",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-[#737373]">
                                  Warranty Due Date
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
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal text-sm ",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-[#737373]">
                                  Choose Date
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notes"
                          className="text-sm sm:text-base"
                          {...field}
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
            {/* 
                <FormField
                  control={form.control}
                  name="asset_condition_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {condition.map((con) => (
                              <SelectItem
                                key={con.asset_condition_name}
                                value={con.asset_condition_name}
                              >
                                {con.asset_condition_name}
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
                name="aging"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Aging"
                        {...field}
                        className="text-sm sm:text-base"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            */}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AssetForm;

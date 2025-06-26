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
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useMisc } from "@/context/miscellaneousContext";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { differenceInMonths, format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useEffect } from "react";
import { useAsset } from "@/context/assetContext";
import { toast } from "sonner";

const formSchema = z.object({
  asset_name: z.string().optional(),
  serial_number: z.string().optional(),
  brand: z.string().optional(),
  category_id: z.coerce.number().optional(),
  sub_category_id: z.coerce.number().optional(),
  type_id: z.coerce.number().optional(),
  location: z.string().optional(),
  availability_status_id: z.coerce.number().optional(),
  specifications: z.string().optional(),
  asset_amount: z.number().optional(),
  asset_condition_id: z.coerce.number().optional(),
  purchase_date: z.date().optional(),
  warranty_due_date: z.date().optional(),
  warranty_duration: z.number().optional(),
  notes: z.string().optional(),
  
  file: z
    .union([
      z.string(),
      z.instanceof(File),
      z.array(z.instanceof(File)),
      z.array(z.string()),
    ]).optional(),
 
});

export function UpdateAsset() {
  const { currentAsset, updateAsset } = useAsset();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_name: "",
      serial_number: "",
      brand: "",
      category_id: currentAsset?.category_id !== undefined ? Number(currentAsset.category_id) : undefined,
      sub_category_id: currentAsset?.sub_category_id !== undefined ? Number(currentAsset.sub_category_id) : undefined,
      type_id: currentAsset?.type_id !== undefined ? Number(currentAsset.type_id) : undefined,
      location:"",
      availability_status_id: currentAsset?.availability_status_id !== undefined ? Number(currentAsset.availability_status_id) : undefined,
      specifications: "",
      asset_amount: 1,
      asset_condition_id: currentAsset?.asset_condition_id !== undefined ? Number(currentAsset.asset_condition_id) : undefined,
      purchase_date: new Date(),
      warranty_due_date: undefined,
      warranty_duration: 0,
      notes: "",
      
      file: [],
    },
  });

  const {
    category,
    setCategoryID,
    subcategory,
    setSubCategoryID,
    filteredSubcategories,
    type,
    categoryID,
    subCategoryID,
    status,
    condition,
    typeID,
    setTypeID,
  } = useMisc();

  useEffect(() => {
    if (currentAsset) {
      form.reset({
        ...currentAsset,
        availability_status_id: String(currentAsset.status_id),
        warranty_due_date: new Date(currentAsset.warranty_due_date),
        purchase_date: new Date(currentAsset.purchase_date),
        file: currentAsset.file ?? "",
      });

      setCategoryID(Number(currentAsset.category_id));
      setSubCategoryID(Number(currentAsset.sub_category_id));
    }
  }, [currentAsset, form, setCategoryID, setSubCategoryID]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    const newValues = {
      ...values,
      status_id: values.availability_status_id
    }

    console.log("🚀 SUBMIT CLICKED");

    if (!currentAsset?.asset_id) {
      console.error("Missing asset_id!");
      toast.error("Asset ID is missing, cannot update the asset.");
      return;
    }


    try {
      const response = await updateAsset(currentAsset.asset_id, newValues);
      console.log("🚀 response", newValues);

      if (response && Object.keys(response).length > 0) {
        toast.success("Asset updated successfully!");
      } else {
        toast.error(
          `Failed to update asset: ${response?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("🔥 Update error:", error);
    }
  }

  const p = form.watch("purchase_date");
  const w = form.watch("warranty_due_date");

  return (
    <div className="flex flex-col ml-[calc(7rem+10px)] mt-15px mr-[calc(2.5rem)] h-full ">
      <div className="flex flex-row items-center justify-between">
        <p className="pl-1 pt-5 mb-4 text-lg">Update Asset</p>
        <Button
          variant="link"
          onClick={() => {
            window.location.href = "/assets";
          }}
        >
          <ChevronLeft />
          <p>Back</p>
        </Button>
      </div>
      <div className="w-[calc(100vw-10rem)] rounded-xl bg-white min-h-[calc(100vh-13.10rem)] h-auto p-5 mb-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="asset_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset ID</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          type="text"
                          placeholder="Asset ID"
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
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand" {...field} />
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
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setCategoryID(Number(value));
                            form.setValue("sub_category_id", undefined);
                            setSubCategoryID(null);
                          }}
                          value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {category.map((cat) => (
                              <SelectItem
                                key={cat.category_id}
                                value={String(cat.category_id)}
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
                            {...field}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSubCategoryID(Number(value));
                            }}
                            value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredSubcategories.map((sub) => (
                                <SelectItem
                                  key={sub.sub_category_id}
                                  value={String(sub.sub_category_id)}
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
                  <FormField
                    control={form.control}
                    name="type_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setTypeID(Number(value)); 
                            }}
                            value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {type.map((type) => (
                                <SelectItem
                                  key={type.type_id}
                                  value={String(type.type_id)}
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
                )}<FormField
                  control={form.control}
                  name="availability_status_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {status
                              .filter((stat) => stat.function_id === 1)
                              .map((stat) => (
                                <SelectItem
                                  key={stat.status_id}
                                  value={stat.status_id.toString()}
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
                /><FormField
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
                          min={1}
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
                  name="asset_condition_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {condition.map((con) => (
                              <SelectItem
                                key={con.asset_condition_id}
                                value={String(con.asset_condition_id)}
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
                              onSelect={(date) => {
                                if (!date) return;
                                if (w && date) {
                                  const duration = differenceInMonths(w, date);
                                  form.setValue("warranty_duration", duration, {
                                    shouldValidate: true,
                                  });
                                }
                                field.onChange(date);
                              }}
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
                              onSelect={(date) => {
                                if (!date) return;
                                if (date && p) {
                                  const duration = differenceInMonths(date, p);
                                  form.setValue("warranty_duration", duration, {
                                    shouldValidate: true,
                                  });
                                }
                                field.onChange(date);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /><FormField
                  control={form.control}
                  name="warranty_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Duration (in months)</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          type="number"
                          className="text-sm sm:text-base"
                          placeholder="Ex. 365"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /><FormField
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
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...rest } }) => {
                    const filesArray = Array.isArray(value)
                      ? value
                      : typeof value === "string" && value.length > 0
                      ? value.split(",").map((v) => v.trim())
                      : [];

                    return (
                      <FormItem>
                        <div className="grid w-full items-center gap-1.5">
                          <FormLabel htmlFor="picture">Picture</FormLabel>
                          <FormControl>
                            <Input
                              id="picture"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  onChange(Array.from(files));
                                }
                              }}
                              {...rest}
                            />
                          </FormControl>

                          {typeof value === "string" &&
                            !value.includes(",") &&
                            value && (
                              <>
                                <p className="text-sm text-gray-600 mt-1">
                                  Current file: {value}
                                </p>
                                <img
                                  src={`http://localhost/itam_api/${value}`}
                                  alt="Uploaded"
                                  className="mt-2 rounded-md border max-w-full h-auto"
                                  style={{ maxWidth: "150px" }}
                                />
                              </>
                            )}
                          {filesArray.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-1">
                                Uploaded files:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {filesArray.map((fileName, index) => (
                                  <img
                                    key={index}
                                    src={`http://localhost/itam_api/${fileName}`}
                                    alt={`Uploaded ${index}`}
                                    className="max-w-[100px] max-h-[100px]"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormItem>
                    );
                  }}
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

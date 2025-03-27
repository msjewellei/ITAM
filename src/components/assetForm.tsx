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
import { toast } from "sonner";
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
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Asset {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    subcategory?: {
      id: number;
      name: string;
      type?: {
        id: number;
        name: string;
      };
    };
  };
}

const formSchema = z.object({
  asset_id: z.number().min(1).optional(),
  asset_name: z.string().min(2).max(50),
  category_id: z.number().min(1).optional(),
  category_name: z.string(),
  sub_category_id: z.number().min(1).optional(),
  sub_category_name: z.string().optional(),
  type_id: z.number().min(1).optional(),
  type_name: z.string().optional(),
  location: z.string().min(2).max(50),
  asset_condition_id: z.number().min(1).optional(),
  asset_condition_name: z.string().min(2).max(50),
  availability_status: z.string().min(2).max(50),
  serial_number: z.string().min(2).max(50),
  specifications: z.string().min(2).max(100),
  asset_amount: z.number(),
  warranty_duration: z.string().min(2).max(50),
  warranty_due_date: z.date(),
  purchase_date: z.date(),
  aging: z.number(),
  notes: z.string(),
});

function AssetForm() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [category, setCategory] = useState<{ id: number; name: string }[]>([]);
  const [subcategory, setSubCategory] = useState<
    { id: number; name: string }[]
  >([]);
  const [type, setType] = useState<{ id: number; name: string }[]>([]);
  const [categoryID, setCategoryID] = useState<string | null>(null);
  const [subCategoryID, setSubCategoryID] = useState<string | null>(null);
  const [typeID, setTypeID] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_id: undefined,
      asset_name: "",
      category_id: undefined,
      category_name: "",
      sub_category_id: undefined,
      sub_category_name: "",
      type_id: undefined,
      type_name: "",
      location: "",
      asset_condition_id: undefined,
      asset_condition_name: "",
      availability_status: "",
      serial_number: "",
      specifications: "",
      asset_amount: undefined,
      warranty_duration: "",
      warranty_due_date: new Date(),
      purchase_date: new Date(),
      aging: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("/categoryData.json");

      const uniqueCategories: { id: number; name: string }[] = Array.from(
        new Map<number, { id: number; name: string }>(
          response.data.asset.map((asset: Asset) => [
            asset.category.id,
            { id: asset.category.id, name: asset.category.name },
          ])
        ).values()
      );

      setCategory(uniqueCategories);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const setup = async () => {
      const response = await axios.get("/categoryData.json");
      setAssets(response.data.asset);
    };
    setup();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      const response = await axios.get("/categoryData.json");
      const uniqueSubCategories: { id: number; name: string }[] = Array.from(
        new Map<number, { id: number; name: string }>(
          response.data.asset
            .filter((asset: Asset) => asset.category.id === Number(categoryID))
            .map((asset: Asset) => [
              asset.category.subcategory?.id!,
              {
                id: asset.category.subcategory?.id!,
                name: asset.category.subcategory?.name!,
              },
            ])
        ).values()
      );

      setSubCategory(uniqueSubCategories);
    };

    if (categoryID) {
      fetchSubCategories();
    }
  }, [categoryID]);

  useEffect(() => {
    const fetchTypes = async () => {
      const response = await axios.get("/categoryData.json");
      const uniqueTypes: { id: number; name: string }[] = Array.from(
        new Map<number, { id: number; name: string }>(
          response.data.asset
            .filter((asset: Asset) => asset.category.id === Number(categoryID))
            .map((asset: Asset) => [
              asset.category.subcategory?.type?.id!,
              {
                id: asset.category.subcategory?.type?.id!,
                name: asset.category.subcategory?.type?.name!,
              },
            ])
        ).values()
      );

      setType(uniqueTypes);
    };

    if (categoryID && subCategoryID) {
      fetchTypes();
    }
  }, [categoryID, subCategoryID]);

  const filteredAssets = useMemo(() => {
    let currentAssets = assets;
    if (categoryID) {
      currentAssets = currentAssets.filter(
        (asset) => asset.category.id === Number(categoryID) // Compare by ID
      );
    }
    if (subCategoryID) {
      currentAssets = currentAssets.filter(
        (asset) => asset.category.subcategory?.name === subCategoryID
      );
    }
    if (typeID) {
      currentAssets = currentAssets.filter(
        (asset) => asset.category.subcategory?.type?.name === typeID
      );
    }

    return currentAssets;
  }, [categoryID, subCategoryID, typeID, assets]);

  const assetCategory = useMemo(() => {
    return category.find((cat) => cat.id === Number(categoryID)) || null;
  }, [categoryID, category]);

  const assetSubCategory = useMemo(() => {
    if (!subCategoryID) return [];
    return assets
      .filter((asset) => asset.category.subcategory)
      .map((asset) => asset.category.subcategory!)
      .filter(
        (subcategory) => subcategory && subcategory.id === Number(subCategoryID)
      );
  }, [subCategoryID]);

  function onSubmit(values: z.infer<typeof formSchema>) {
  }

  const {
    handleSubmit,
    formState: { errors },
  } = form;
  
  return (
    <div className="pl-5 pr-5">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="asset_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Asset ID"
                        {...field}
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
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
            </div>
          </div>

          <div className="w-full">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                    {...field}
                      onValueChange={(value) => {
                        field.onChange(
                          value === "reset" ? undefined : Number(value)
                        );
                        setCategoryID(value === "reset" ? null : value);
                      }}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reset">Select a category</SelectItem>
                        {category
                          .filter((cat) => cat.id && cat.name) // Ensure valid data
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
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

          {Number(categoryID) === 2 && (
            <div className={`flex flex-col sm:flex-row gap-4`}>
              <div
                className={`transition-all duration-200 ${
                  subCategoryID === "6" ? "sm:w-1/2" : "sm:w-full"
                }`}
              >
                <FormField
                  control={form.control}
                  name="sub_category_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                        {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSubCategoryID(value);
                          }}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sub Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {subcategory
                              .filter((sub) => sub.id && sub.name)
                              .map((sub) => (
                                <SelectItem
                                  key={sub.id}
                                  value={sub.id.toString()}
                                >
                                  {sub.name}
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

              {subCategoryID === "6" && (
                <div className="w-full sm:w-1/2 transition-all duration-200">
                  <FormField
                    control={form.control}
                    name="type_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                          {...field}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setTypeID(value);
                            }}
                            value={field.value || ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {type
                                .filter((type) => type.id && type.name)
                                .map((type) => (
                                  <SelectItem
                                    key={type.id}
                                    value={type.id.toString()}
                                  >
                                    {type.name}
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

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
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

            <div className="w-full sm:w-1/2">
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
            </div>
          </div>
          <div className="w-full max-w-md">
            <FormField
              control={form.control}
              name="availability_status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                    {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Availability Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Borrowed">Borrowed</SelectItem>
                        <SelectItem value="Issued">Issued</SelectItem>
                        <SelectItem value="Under Repair">
                          Under Repair
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full max-w-md">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
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
          </div>
          <div className="w-full max-w-md">
            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Specifications"
                      className="text-sm sm:text-base"
                    />
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
                name="warranty_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Warranty Duration"
                        className="text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <FormField
                control={form.control}
                name="warranty_due_date"
                render={({ field }) => (
                  <FormItem>
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
                            {...field}
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

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-full sm:w-1/2">
            <FormField
                control={form.control}
                name="asset_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="name" placeholder="Asset Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
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
                                Purchase Date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            {...field}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notes"
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              className="w-full text-sm sm:text-base"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AssetForm;

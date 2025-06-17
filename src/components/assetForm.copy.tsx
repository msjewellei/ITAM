import { array, z } from "zod";
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
import { differenceInMonths, format, startOfDay } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import Fuse from "fuse.js";
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
import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "./ui/dialog";
import InsuranceDialog from "./insuranceDialog";

const formSchema = z.object({
  asset_name: z.string(),
  type_id: z.string(),
  location: z.string(),
  serial_number: z.string(),
  specifications: z.string(),
  asset_amount: z.coerce.number().min(1),
  warranty_duration: z.number(),
  warranty_due_date: z.date(),
  purchase_date: z.date(),
  notes: z.string(),
  brand: z.string(),
  file: z.array(z.instanceof(File)).optional(),
  insurance_coverage: z.string().optional(),
  insurance_date_from: z.date().optional(),
  insurance_date_to: z.date().optional(),
  category: z.object({
    category_id: z.number(),
    sub_category_id: z.number().nullable(),
    type_id: z.number().nullable(),
  }),
});

function AssetForm() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);

  const { category, subcategory, mappedtype, type, categoryID } = useMisc();

  const {
    handleInsuranceSave,
    insurance,
    setInsuranceDialogOpen,
    isInsuranceDialogOpen,
    insertAsset,
  } = useAsset();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_name: "",
      type_id: "",
      location: "",
      serial_number: "",
      specifications: "",
      asset_amount: 1,
      warranty_duration: 0,
      warranty_due_date: new Date(),
      purchase_date: new Date(),
      notes: "",
      brand: "",
      insurance_coverage: "",
      insurance_date_from: new Date(),
      insurance_date_to: new Date(),
      file: [],
      category: {
        category_id: 0,
        sub_category_id: null,
        type_id: null,
      },
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await form.trigger();
    const errors = form.formState.errors;

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (matches.length > 0) {
      toast.error("Invalid subcategory! It has a similar name in the stocks.");
      return;
    }

    const finalValues = {
      ...values,
      category_id: values.category?.category_id || "",
      sub_category_id: values.category?.sub_category_id || "",
      type_id: values.category?.type_id || "",
      insurance_coverage: insurance.coverage || "",
      insurance_date_from: insurance.dateFrom || "",
      insurance_date_to: insurance.dateTo || "",
    };

    // console.log("Final Values:", finalValues);

    try {
      const response = await insertAsset(finalValues);

      if (response && Object.keys(response).length > 0) {
        toast.success("Asset successfully added! 🎉");
        navigate("/assets");
      } else {
        toast.error(
          `Failed to add asset: ${response?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const subcategoryFuse = new Fuse(subcategory, {
    keys: ["sub_category_name"],
    threshold: 0.3,
  });

  const typeFuse = new Fuse(type, {
    keys: ["type_name"],
    threshold: 0.4,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const combinedInitial = [...subcategory, ...type].sort((a, b) => {
    const nameA = (a.sub_category_name || a.type_name || "").toLowerCase();
    const nameB = (b.sub_category_name || b.type_name || "").toLowerCase();

    return nameA.localeCompare(nameB);
  });
  const [filteredResults, setFilteredResults] = useState(combinedInitial);

  const { setError, clearErrors } = form;

  const p = form.watch("purchase_date");
  const w = form.watch("warranty_due_date");
  const [open, setOpen] = useState(false);
  const value = form.watch("sub_category_id");
  useEffect(() => {
    if (form.getValues("purchase_date")) {
      const purchaseDate = startOfDay(
        new Date(form.getValues("purchase_date"))
      );
      const warrantyDueDate = startOfDay(
        new Date(form.getValues("warranty_due_date"))
      );

      const duration = differenceInMonths(warrantyDueDate, purchaseDate);
      form.setValue("warranty_duration", duration || 0, {
        shouldValidate: true,
      });
    }
  }, [form.watch("purchase_date"), form.watch("warranty_due_date")]);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Dialog open={isInsuranceDialogOpen} onOpenChange={setInsuranceDialogOpen}>
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
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
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
                    name="category"
                    render={({ field }) => {
                      const displayValue = inputValue;

                      return (
                        <FormItem>
                          <FormLabel className="text-black">
                            Subcategory or Type
                          </FormLabel>
                          <FormControl>
                            <Popover
                              open={open}
                              onOpenChange={(isOpen) => {
                                setOpen(isOpen);
                                if (isOpen) {
                                  const combined = [
                                    ...subcategory,
                                    ...type,
                                  ].sort((a, b) => {
                                    const nameA = (
                                      a.sub_category_name ||
                                      a.type_name ||
                                      ""
                                    ).toLowerCase();
                                    const nameB = (
                                      b.sub_category_name ||
                                      b.type_name ||
                                      ""
                                    ).toLowerCase();
                                    return nameA.localeCompare(nameB);
                                  });
                                  setFilteredResults(combined);
                                  setMatches([]);
                                }
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-full justify-between text-left font-normal truncate"
                                >
                                  <span
                                    className={
                                      displayValue
                                        ? "text-black"
                                        : "text-gray-500"
                                    }
                                  >
                                    {displayValue || "Select or type..."}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search subcategories or types..."
                                    className="h-9 px-3 text-sm text-black focus:ring-0 focus:outline-none"
                                    value={inputValue}
                                    onValueChange={(val) => {
                                      setInputValue(val);
                                      field.onChange({
                                        category_id: null,
                                        sub_category_id: null,
                                        type_id: null,
                                        searchString: val,
                                      });

                                      const typeResults = typeFuse.search(val);
                                      const subcatResults =
                                        subcategoryFuse.search(val);
                                      setMatches([
                                        ...typeResults,
                                        ...subcatResults,
                                      ]);

                                      const filtered = [
                                        ...subcategory.filter((s) =>
                                          s.sub_category_name
                                            .toLowerCase()
                                            .includes(val.toLowerCase())
                                        ),
                                        ...type.filter((t) =>
                                          t.type_name
                                            .toLowerCase()
                                            .includes(val.toLowerCase())
                                        ),
                                      ].sort((a, b) => {
                                        const nameA = (
                                          a.sub_category_name ||
                                          a.type_name ||
                                          ""
                                        ).toLowerCase();
                                        const nameB = (
                                          b.sub_category_name ||
                                          b.type_name ||
                                          ""
                                        ).toLowerCase();
                                        return nameA.localeCompare(nameB);
                                      });

                                      setFilteredResults(filtered);

                                      if (
                                        typeResults.length +
                                          subcatResults.length >
                                        0
                                      ) {
                                        clearErrors("sub_category_id");
                                      } else {
                                        setError("sub_category_id", {
                                          type: "manual",
                                          message: "No match found",
                                        });
                                      }
                                    }}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      {matches.length > 0
                                        ? "There are similar items in stock, check them"
                                        : "No results found."}
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredResults.map((item) => {
                                        const isSubcategory =
                                          "sub_category_id" in item;
                                        const label =
                                          item.sub_category_name ||
                                          item.type_name ||
                                          "Unnamed";
                                        const id = isSubcategory
                                          ? item.sub_category_id
                                          : item.type_id;
                                        const categoryId = item.category_id;

                                        return (
                                          <CommandItem
                                            key={id}
                                            value={label}
                                            onSelect={() => {
                                              if (isSubcategory) {
                                                const newValue = {
                                                  category_id: categoryId,
                                                  sub_category_id:
                                                    item.sub_category_id,
                                                  type_id: undefined,
                                                };
                                                field.onChange(newValue);
                                                setInputValue(
                                                  item.sub_category_name
                                                );
                                              } else {
                                                const typeId = String(
                                                  item.type_id
                                                ).trim();

                                                const mapping = mappedtype.find(
                                                  (m) =>
                                                    String(m.id).trim() ===
                                                    typeId
                                                );

                                                const sub = subcategory.find(
                                                  (s) =>
                                                    s.sub_category_id ===
                                                    mapping?.sub_category_id
                                                );

                                                const newValue = {
                                                  category_id:
                                                    sub?.category_id ?? null,
                                                  sub_category_id:
                                                    sub?.sub_category_id ??
                                                    null,
                                                  type_id: item.type_id,
                                                };

                                                // console.log(newValue);
                                                field.onChange(newValue);
                                                setInputValue(item.type_name);
                                              }
                                              setOpen(false);
                                            }}
                                            className="text-sm text-black flex flex-col items-start"
                                          >
                                            <span className="font-medium">
                                              {item.sub_category_name ||
                                                item.type_name}
                                            </span>
                                            <span className="text-xs text-gray-600">
                                              {(() => {
                                                if (
                                                  "sub_category_name" in item
                                                ) {
                                                  const foundCategory =
                                                    category.find(
                                                      (c) =>
                                                        c.category_id ===
                                                        item.category_id
                                                    );
                                                  const categoryName =
                                                    foundCategory
                                                      ? foundCategory.category_name
                                                      : "Unknown Category";
                                                  return `${categoryName}`;
                                                } else if (
                                                  "type_name" in item
                                                ) {
                                                  const typeId = String(
                                                    item.type_id
                                                  ).trim();

                                                  const mapping =
                                                    mappedtype.find(
                                                      (m) =>
                                                        String(m.id).trim() ===
                                                        typeId
                                                    );

                                                  if (!mapping) {
                                                    console.warn(
                                                      `No mapping found for type_id: ${typeId}`
                                                    );
                                                    return `Mapping Not Found for type_id: ${typeId}`;
                                                  }

                                                  const sub = subcategory.find(
                                                    (s) =>
                                                      s.sub_category_id ===
                                                      mapping.sub_category_id
                                                  );

                                                  if (!sub) {
                                                    console.warn(
                                                      `No subcategory found for parent_id: ${mapping.sub_category_id}`
                                                    );
                                                    return `Unknown Category > Unknown Subcategory`;
                                                  }

                                                  const foundCategory =
                                                    category.find(
                                                      (c) =>
                                                        c.category_id ===
                                                        sub.category_id
                                                    );

                                                  const categoryName =
                                                    foundCategory
                                                      ? foundCategory.category_name
                                                      : "Unknown Category";

                                                  return `${categoryName} > ${sub.sub_category_name}`;
                                                }

                                                return "Unknown";
                                              })()}
                                            </span>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {categoryID === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="asset_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Ex. TPLink"
                                {...field}
                                className="text-sm sm:text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    </>
                  )}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            className="text-sm sm:text-base"
                            placeholder="Ex. Dell"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  {insurance && (
                    <div className="border border-dashed border-green-500 rounded-md p-4 space-y-4">
                      <FormField
                        control={form.control}
                        name="insurance_coverage"
                        render={() => (
                          <FormItem>
                            <FormLabel>Coverage</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Coverage"
                                className="text-sm sm:text-base"
                                value={insurance.coverage || ""}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="insurance_date_from"
                            render={() => (
                              <FormItem>
                                <FormLabel>Date From</FormLabel>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm",
                                      !insurance?.dateFrom &&
                                        "text-muted-foreground",
                                      "cursor-default"
                                    )}
                                    disabled
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                                    {insurance?.dateFrom ? (
                                      new Date(
                                        insurance.dateFrom
                                      ).toLocaleDateString()
                                    ) : (
                                      <span className="text-[#737373]">
                                        Choose Date
                                      </span>
                                    )}
                                  </Button>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-6 text-center text-lg pb-1">-</div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="insurance_date_to"
                            render={() => (
                              <FormItem>
                                <FormLabel>Date To</FormLabel>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm",
                                      !insurance?.dateTo &&
                                        "text-muted-foreground",
                                      "cursor-default"
                                    )}
                                    disabled
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#737373]" />
                                    {insurance?.dateTo ? (
                                      new Date(
                                        insurance.dateTo
                                      ).toLocaleDateString()
                                    ) : (
                                      <span className="text-[#737373]">
                                        Choose Date
                                      </span>
                                    )}
                                  </Button>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (!date) return;
                                  const duration = differenceInMonths(w, date);
                                  form.setValue("warranty_duration", duration, {
                                    shouldValidate: true,
                                  });
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (!date) return;
                                  const duration = differenceInMonths(date, p);
                                  form.setValue("warranty_duration", duration, {
                                    shouldValidate: true,
                                  });
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
                    name="warranty_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warranty Duration (in days)</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <FormLabel htmlFor="picture">Picture</FormLabel>
                          <FormControl>
                            <Input
                              multiple
                              id="picture"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  onChange(Array.from(e.target.files));
                                }
                              }}
                              {...rest}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <DialogTrigger asChild>
                  <Button
                    className="w-fit text-xs sm:text-sm gap-1 text-green-400"
                    variant="link"
                    onClick={() => setInsuranceDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 text-green-400" />
                    Add Insurance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <InsuranceDialog
                    onSave={handleInsuranceSave}
                    onClose={() => setInsuranceDialogOpen(false)}
                  />
                </DialogContent>

                <Button className="w-fit text-xs sm:text-sm" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Dialog>
  );
}

export default AssetForm;

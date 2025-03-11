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
import { useMisc } from "@/context/miscellaneousContext";

const formSchema = z.object({
  asset_name: z.string().min(2).max(50),
  category_id: z.number(),
  sub_category_id: z.number(),
  type_id: z.number(),
  location: z.string().min(2).max(50),
  asset_condition_id: z.number(),
  availability_status_id: z.number(),
  serial_number: z.string().min(2).max(50),
  specifications: z.string().min(2).max(100),
  asset_amount: z.number(),
  warranty_duration: z.string().min(2).max(50),
  warranty_due_date: z.date(),
  purchase_date: z.date(),
  aging: z.number(),
  notes: z.string().min(2).max(50),
});

function AssetForm() {
  const {
    category,
    subcategory,
    type,
    filteredSubcategories,
    setCategoryID,
    setSubCategoryID,
    subCategoryID,
  } = useMisc();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_name: "",
      category_id: 0,
      sub_category_id: 0,
      type_id: 0,
      location: "",
      asset_condition_id: 0,
      availability_status_id: 0,
      serial_number: "",
      specifications: "",
      asset_amount: 0,
      warranty_duration: "",
      warranty_due_date: new Date(),
      purchase_date: new Date(),
      aging: 0,
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="pl-5 pr-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
                        placeholder="Asset Name"
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
                        field.onChange(Number(value));
                        setCategoryID(Number(value));
                      }}
                      value={field.value.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-1">
                          Select a category
                        </SelectItem>
                        {console.log(category)}
                        {category.map((cat) => (
                          <SelectItem
                            key={cat.category_id}
                            value={cat.category_id}
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
          </div>

          {filteredSubcategories.length > 0 && (
            <div className={`flex flex-col sm:flex-row gap-4`}>
              <div className={`transition-all duration-200`}>
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
                              .filter(
                                (sub) =>
                                  sub.sub_category_id && sub.sub_category_name
                              )
                              .map((sub) => (
                                <SelectItem
                                  key={sub.sub_category_id}
                                  value={sub.sub_category_id.toString()}
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
              </div>

              {subCategoryID === 6 && (
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
                                .filter(
                                  (type) => type.type_id && type.type_name
                                )
                                .map((type) => (
                                  <SelectItem
                                    key={type.type_id}
                                    value={type.type_id.toString()}
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
                      <Input
                        type="name"
                        placeholder="Asset Amount"
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
            <Button className="w-full text-sm sm:text-base" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AssetForm;

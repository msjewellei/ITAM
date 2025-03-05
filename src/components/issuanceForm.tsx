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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  company: z.string().min(2).max(50),
  department: z.string().min(2).max(50),
  unit: z.string().min(2).max(50),
  employeeName: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  subcategory: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  assetName: z.string().min(2).max(50),
  issuanceDate: z.date(),
  status: z.string().min(2).max(50),
});

function IssuanceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      department: "",
      unit: "",
      employeeName: "",
      category: "",
      subcategory: "",
      type: "",
      assetName: "",
      issuanceDate: undefined,
      status: "",
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
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United Neon Advertising, Inc.">
                          United Neon Advertising, Inc.
                        </SelectItem>
                        <SelectItem value="Breakthrough Leadership Management Consultancy, In">
                          Breakthrough Leadership Management Consultancy, In
                        </SelectItem>
                        <SelectItem value="InnovationOne Inc.">
                          InnovationOne Inc.
                        </SelectItem>
                        <SelectItem value="Inspire Leadership Consultancy Inc.">
                          Inspire Leadership Consultancy Inc.
                        </SelectItem>
                        <SelectItem value="Media Display Solutions">
                          Media Display Solutions
                        </SelectItem>
                        <SelectItem value="Onion Bulb Production">
                          Onion Bulb Production
                        </SelectItem>
                        <SelectItem value="PLUS Media">PLUS Media</SelectItem>
                        <SelectItem value="SeeWorthy International/LinkOD">
                          SeeWorthy International/LinkOD
                        </SelectItem>
                        <SelectItem value="TapAds Media Corp">
                          TapAds Media Corp
                        </SelectItem>
                        <SelectItem value="United Neon Foundation Inc.">
                          United Neon Foundation Inc.
                        </SelectItem>
                        <SelectItem value="United Transit Ads System Inc.">
                          United Transit Ads System Inc.
                        </SelectItem>
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Department 1">
                            Department 1
                          </SelectItem>
                          <SelectItem value="Department 2">
                            Department 2
                          </SelectItem>
                          <SelectItem value="Department 3">
                            Department 3
                          </SelectItem>
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unit 1">Unit 1</SelectItem>
                          <SelectItem value="Unit 2">Unit 2</SelectItem>
                          <SelectItem value="Unit 3">Unit 3</SelectItem>
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
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="name" placeholder="Employee Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="category"
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
                name="subcategory"
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
                name="type"
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
              name="assetName"
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
          <div className="w-full">
            <FormField
              control={form.control}
              name="issuanceDate"
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
                              Issuance Date
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
          <div className="w-full">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
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

export default IssuanceForm;

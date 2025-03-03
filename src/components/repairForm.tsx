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

const formSchema = z.object({
  department: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  subcategory: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  assetName: z.string().min(2).max(50),
  issue: z.string().min(2).max(100),
  remarks: z.string().min(2).max(100),
  dateReported: z.date(),
  urgencyLevel: z.string().min(2).max(100),
  repairStartDate: z.date(),
  repairEndDate: z.date(),
  status: z.string().min(2).max(50),
  repairCost: z.number().min(0),
});

function RepairForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      name: "",
      category: "",
      subcategory: "",
      type: "",
      assetName: "",
      issue: "",
      remarks: "",
      dateReported: undefined,
      urgencyLevel: "",
      repairStartDate: undefined,
      repairEndDate: undefined,
      status: "",
      repairCost: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="pl-5 pr-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="name"
                        placeholder="Requester Name"
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
              name="issue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="issue" placeholder="Issue" {...field} />
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="dateReported"
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
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Urgency Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="repairStartDate"
                render={({ field }) => (
                  <FormItem>
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
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="repairEndDate"
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
                                Repair End Date
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
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2 max-w-sm">
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
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
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
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="repairCost"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="name" placeholder="Repair Cost" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default RepairForm;

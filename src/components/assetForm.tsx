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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  serialNumber: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  subCategory: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  condition: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  specification: z.string().min(2).max(100),
  warrantyDuration: z.string().min(2).max(50),
  aging: z.number().min(0),
  warrantyDueDate: z.date(),
  purchaseDate: z.date(),
  notes: z.string().min(2).max(100),
});

function AssetForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      category: "",
      subCategory: "",
      type: "",
      condition: "",
      location: "",
      specification: "",
      warrantyDuration: "",
      aging: undefined,
      warrantyDueDate: undefined,
      purchaseDate: undefined,
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="pl-5 pr-5">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
  <div className="flex flex-col sm:flex-row gap-4">

            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Asset Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Serial Number"
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
                        <SelectItem value="External">External</SelectItem>
                        <SelectItem value="Internal">Internal</SelectItem>
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
                name="subCategory"
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
                          <SelectItem value="Routers and Switches">
                            Routers and Switches
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
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Mouse">Mouse</SelectItem>
                          <SelectItem value="Keyboard">Keyboard</SelectItem>
                          <SelectItem value="Ups Battery">
                            Ups Battery
                          </SelectItem>
                          <SelectItem value="Numeric Keypad">
                            Numeric Keypad
                          </SelectItem>
                          <SelectItem value="USB Dongle LAN">
                            USB Dongle LAN
                          </SelectItem>
                          <SelectItem value="Video Capture">
                            Video Capture
                          </SelectItem>
                          <SelectItem value="USB-C Adapter 4 in 1">
                            USB-C Adapter 4 in 1
                          </SelectItem>
                          <SelectItem value="HDMI to VGA Adapter">
                            HDMI to VGA Adapter
                          </SelectItem>
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
                name="condition"
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

            <div className="w-full sm:w-1/2 max-w-sm">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Location" {...field} />
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
              name="specification"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder="Specifications" />
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
                name="warrantyDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Warranty Duration"
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
                name="aging"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="name"
                        placeholder="Aging"
                        {...field}
                        className="text-sm sm:text-base"
                      />
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
                name="warrantyDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-sm sm:text-base",
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
            </div>

            <div className="w-full sm:w-1/2">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-sm sm:text-base",
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

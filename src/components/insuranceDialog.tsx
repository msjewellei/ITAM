import { DialogContent } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { Input } from "./ui/input";

export default function InsuranceDialog({ onSave, onClose }) {
  const formSchema = z.object({
    insurance_name: z.string().optional(),
    insuranceCoverage: z.string().optional(),
    insurance_date_from: z.date(),
    insurance_date_to: z.date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurance_name: "",
      insuranceCoverage: "",
      insurance_date_from: new Date(),
      insurance_date_to: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      name: data.insurance_name,
      coverage: data.insuranceCoverage,
      dateFrom: data.insurance_date_from,
      dateTo: data.insurance_date_to,
    });
    console.log("Insurance data saved:", data);
    onClose();
    toast.success("Insurance saved successfully!");
  };

  const onError = (errors: any) => {
    console.log("Insurance form errors:", errors);
    toast.error("Please fill out all insurance fields before saving.");
  };

  return (
    <DialogContent>
      <h2 className="text-center">Add Insurance</h2>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="insurance_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-sm sm:text-base"
                    placeholder="Enter insurance name here"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insuranceCoverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coverage</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="text-sm sm:text-base"
                    placeholder="Enter coverage here"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date From</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-sm",
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
                            onSelect={(date) => field.onChange(date)}
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
            <div className="w-6 text-center text-lg pb-1">-</div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="insurance_date_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date To</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-sm",
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
                            onSelect={(date) => field.onChange(date)}
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit, onError)}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}

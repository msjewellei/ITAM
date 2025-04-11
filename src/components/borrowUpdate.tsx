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
import { differenceInDays, format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { useBorrow } from "@/context/borrowContext";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  return_date: z.date(),
  duration: z.number(),
  asset_condition_id: z.string(),
});

export function BorrowUpdate() {
  const { condition } = useMisc();
  const { borrowID, updateBorrow, dateBorrowed } = useBorrow();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      return_date: new Date(),
      duration: 0,
      asset_condition_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.asset_condition_id = condition.find(
      (cat) => cat.asset_condition_name === values.asset_condition_id
    )?.asset_condition_id;
    if (!borrowID) {
      console.error("Missing borrowID!");
      return;
    }
    const adjustedDate = format(values.return_date, "yyyy-MM-dd");

    try {
      const response = await updateBorrow(borrowID, dateBorrowed, {
        ...values,
        return_date: adjustedDate,
      });

      if (response && Object.keys(response).length > 0) {
        toast.success("Updated borrow transaction successfully!");
      } else {
        toast.error(
          `Failed to update borrow transaction: ${
            response?.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (form.getValues("return_date")) {
      const borrowedDate = startOfDay(new Date(dateBorrowed));
      const returnDate = startOfDay(form.getValues("return_date"));

      const duration = differenceInDays(returnDate, borrowedDate);
      form.setValue("duration", duration || 0, { shouldValidate: true });
    }
  }, [form.watch("return_date"), dateBorrowed]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="return_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Date</FormLabel>
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
                        <span className="text-[#737373]">Return Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (!date) return;
                        form.setValue("return_date", date, {
                          shouldValidate: true,
                        });

                        const borrowedDate = startOfDay(new Date(dateBorrowed));
                        const returnDate = startOfDay(date);

                        const duration = differenceInDays(
                          returnDate,
                          borrowedDate
                        );
                        form.setValue("duration", duration || 0, {
                          shouldValidate: true,
                        });
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (in days)</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="number"
                  className="text-sm sm:text-base"
                  placeholder="Ex. 365"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {condition
                      .filter((c) => c.asset_condition_id !== 4)
                      .map((c) => (
                        <SelectItem
                          key={c.asset_condition_id}
                          value={c.asset_condition_id.toString()} // better to use ID as value
                        >
                          {c.asset_condition_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button className="w-full text-sm sm:text-base" type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

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
import { Link } from "react-router-dom";
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
import { Textarea } from "./ui/textarea";
import { useRepair } from "@/context/repairContext";
import { toast } from "sonner";

const formSchema = z.object({
  repair_completion_date: z.date(),
  status_id: z.string(),
  repair_cost: z.number(),
  remarks: z.string(),
});

export function ReturnDate() {
  const { status, userID } = useMisc();
  const { updateRepair, repairID } = useRepair();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repair_completion_date: new Date(),
      status_id: "",
      repair_cost: 0,
      remarks: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!repairID || !userID) {
      console.error("Missing repairID or userID!");
      return;
    }

    const adjustedDate = format(values.repair_completion_date, "yyyy-MM-dd");

    try {
      const response = await updateRepair(repairID, userID, {
        ...values,
        status_id: Number(values.status_id),
        repair_completion_date: adjustedDate,
      });

      if (response && Object.keys(response).length > 0) {
        toast.success("Updated repair request successfully!");
      } else {
        toast.error(
          `Failed to update repair request: ${
            response?.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="repair_completion_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Completion Date</FormLabel>
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
                        <span className="text-[#737373]">Completion Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={{ after: new Date() }}
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
          name="repair_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
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
          name="status_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {status
                      .filter(
                        (st) => st.function_id === 3 && st.status_id !== 4
                      )
                      .map((st) => (
                        <SelectItem
                          key={st.status_id}
                          value={st.status_id.toString()}
                        >
                          {st.status_name}
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
          name="remarks"
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
        <DialogFooter>
          <Button className="w-full text-sm sm:text-base" type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

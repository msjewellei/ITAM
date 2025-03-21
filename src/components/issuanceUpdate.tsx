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
import { useIssuance } from "@/context/issuanceContext";
import { useAsset } from "@/context/assetContext";

const formSchema = z.object({
  pullout_date: z.date(),
  status_id: z.string(),
});

export function IssuanceUpdate() {
  const { status, userID } = useMisc();
  const { assetID } = useAsset();
  const { updateIssuance, issuanceID } = useIssuance();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    pullout_date: new Date(),
      status_id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values.status_id = status.find(
        (cat) => cat.status_name === values.status_id
      )?.status_id;
    
    if (!issuanceID || !userID || !assetID) { 
      console.error("Missing issuanceID or userID or assetID!");
      return;
    }
    const adjustedDate = format(values.pullout_date, "yyyy-MM-dd");
    const response = await updateIssuance(issuanceID, userID, assetID, {
      ...values,
      pullout_date: adjustedDate,
    });
  console.log(response)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pullout_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pullout Date</FormLabel>
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
                        <span className="text-[#737373]">Date Reported</span>
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
        
        <FormField
          control={form.control}
          name="status_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.map((s) => (
                      <SelectItem
                        key={s.status_name}
                        value={s.status_name}
                      >
                        {s.status_name}
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

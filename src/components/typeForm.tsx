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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { useMisc } from "@/context/miscellaneousContext";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formSchema = z.object({
  subcategory_id: z.string().optional(),
  type_name: z.string().optional(),
});

export function TypeForm() {
  const { subcategory, setSubCategoryID } = useMisc();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subcategory_id: "",
      type_name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //   const response = await updateIssuance(issuanceID, userID, assetID, {
      //     ...values,
      //     pullout_date: adjustedDate,
      //   });

      if (response && Object.keys(response).length > 0) {
        toast.success("Asset issuance updated successfully!");
      } else {
        toast.error(
          `Failed to update asset issuance: ${
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
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSubCategoryID(() => {
                          const item = subcategory.find(
                            (c) => c.sub_category_name === value
                          );

                          if (item) {
                            return Number(item.sub_category_id);
                          }
                          return null;
                        });
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategory.map((cat) => (
                          <SelectItem
                            key={cat.sub_category_name}
                            value={cat.sub_category_name}
                          >
                            {cat.sub_category_name}
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
              name="type_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter name"
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

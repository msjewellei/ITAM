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
import { useMisc } from "@/context/miscellaneousContext";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formSchema = z.object({
  category_id: z.string().optional(),
  sub_category_name: z.string().optional(),
});

export function SubForm() {
  const { category, setCategoryID, insertSubcategory } = useMisc();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: "",
      sub_category_name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // try {
    //   // const response = await insertSubcategory(values);
    //   console.log(values);

    //   if (response && Object.keys(response).length > 0) {
    //     toast.success("Asset issuance updated successfully!");
    //   } else {
    //     toast.error(
    //       `Failed to update asset issuance: ${
    //         response?.error || "Unknown error"
    //       }`
    //     );
    //   }
    // } catch (error) {
    //   toast.error("Something went wrong. Please try again.");
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCategoryID(() => {
                      const item = category.find(
                        (c) => c.category_name === value
                      );

                      if (item) {
                        return Number(item.category_id);
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
                    {category.map((cat) => (
                      <SelectItem
                        key={cat.category_name}
                        value={cat.category_name}
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

        <FormField
          control={form.control}
          name="sub_category_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name" />
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

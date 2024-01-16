"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const FormSchema = z.object({
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  author: z.string().min(2, {
    message: "Author must be at least 2 characters.",
  }),
  description: z.string(),
  flag: z.string().min(2, {
    message: "Flag must be at least 2 characters.",
  }),
  points: z.object({
    min: z.number().min(0, {
      message: "Minimum points must be at least 0.",
    }),
    max: z.number().min(0, {
      message: "Maximum points must be at least 0.",
    }),
  }),
  dynamic: z.object({
    env: z.string().min(2, {
      message: "Environment must be at least 2 characters.",
    }),
    image: z.string().min(2, {
      message: "Image must be at least 2 characters.",
    }),
    type: z.enum(["tcp", "http", "static"], {
      required_error: "You need to select a notification type.",
    }),
  }),
});

function onSubmit(data: z.infer<typeof FormSchema>) {
  console.log(JSON.stringify(data, null, 2));
  toast.success("Successfully created challenge.");
}

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      points: {
        min: 100,
        max: 500,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="crypto" {...field} />
              </FormControl>
              <FormDescription>
                This is the category of the challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="My Challenge" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Author
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is the author of the challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="My Challenge" {...field} />
              </FormControl>
              <FormDescription>
                This is the description of the challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Flag
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="flag{...}" {...field} />
              </FormControl>
              <FormDescription>
                This is the flag of the challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dynamic.type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      All new messages
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mentions" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Direct messages and mentions
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">Nothing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

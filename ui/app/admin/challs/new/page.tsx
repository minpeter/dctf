"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { createChallenge } from "@/api/admin";

import { useRouter } from "next/navigation";

import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
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
  author: z.string().optional(),
  description: z.string().optional(),
  flag: z
    .string()
    .min(6, {
      message: "Flag must be at least 6 characters.",
    })
    .regex(/\{.*\}$/, "Flag must be in the format of xxx{xxx}"),

  points: z.object({
    min: z.number().min(1, {
      message: "Minimum points must be at least 1.",
    }),
    max: z.number().min(2, {
      message: "Maximum points must be at least 2.",
    }),
  }),
  dynamic: z.object({
    env: z
      .string()
      .min(2, {
        message: "Environment must be at least 2 characters.",
      })
      .optional(),
    image: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (isDynamic) {
            if (!val) return false;
            if (val == "") return false;
            return true;
          }
          return true;
        },
        {
          message:
            "when dynamic switch is on, you need to fill dynamic required fields.",
        }
      ),
    type: z
      .enum(["tcp", "http", "static"], {
        required_error: "You need to select a type.",
      })
      .optional()
      .refine(
        (val) => {
          if (isDynamic) {
            if (!val) return false;
            if (!["http", "tcp"].includes(val)) return false;
            return true;
          }
          return true;
        },
        {
          message:
            "when dynamic switch is on, you need to fill dynamic required fields.",
        }
      ),
  }),
});

let isDynamic = false;

export default function Page() {
  const [dynamic, setDynamic] = useState(false);

  const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
    console.log(JSON.stringify(data, null, 2));

    const resp = await createChallenge({ data });
    if (resp.error) {
      toast.error(resp.error);
    } else {
      toast.success("Successfully created challenge.");
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      points: {
        min: 100,
        max: 500,
      },
      dynamic: {
        type: "static",
      },
    },
  });

  useEffect(() => {
    isDynamic = dynamic;

    if (!dynamic) {
      form.setValue("dynamic", {
        type: "static",
        image: "",
      });
    }
  }, [dynamic, form]);

  const router = useRouter();

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
          router.push("/admin/challs");
        })}
        className="space-y-6 flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Input
                    placeholder="crypto | web | system | etc..."
                    {...field}
                  />
                </FormControl>

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

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Aaron Swartz :)" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your challenge description here."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="points.min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum points</FormLabel>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="points.max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum points</FormLabel>
                <FormControl>
                  <Input placeholder="500" {...field} />
                </FormControl>

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

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col  rounded-lg border p-4 gap-6 shadow-sm">
            <div className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Dynamic container</FormLabel>
                <FormDescription>
                  If you want to use dynamic container, please check this box.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={dynamic}
                  onClick={() => setDynamic(!dynamic)}
                />
              </FormControl>
            </div>

            {dynamic && (
              <>
                <FormField
                  control={form.control}
                  name="dynamic.image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Dynamic container image
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="minpeter/mathematician-in-wonderland:latest"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dynamic.type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Dynamic container type
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="http" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              http, connects to use via browser
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="tcp" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              tcp, connects to use via ncat
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

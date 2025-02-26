"use client";

import React from "react";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { SearchIcon } from "lucide-react";

import { engines } from "@/lib/engines";
import { searchErrorMessages } from "@/lib/messages";
import { getEnabledEngines } from "@/lib/settings";

const formSchema = z.object({
  search: z.string().min(1, {
    message:
      searchErrorMessages[
        Math.floor(Math.random() * searchErrorMessages.length)
      ],
  }),
  engine: z.enum(engines.map((e) => e.engine) as [string, ...string[]], {
    message: "Invalid search engine",
  }),
});

const BrowserBar = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const enabledEngines = getEnabledEngines();

  // Make sure we have a default engine even if enabledEngines is empty
  const defaultEngine =
    enabledEngines.length > 0 ? enabledEngines[0].engine : engines[0].engine;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: searchParams.get("q") || "",
      engine: searchParams.get("engine") || defaultEngine,
    },
  });

  React.useEffect(() => {
    // Skip if there are no enabled engines
    if (enabledEngines.length === 0) return;

    const currentEngine = form.getValues("engine");
    if (!enabledEngines.find((e) => e.engine === currentEngine)) {
      const firstEnabled = enabledEngines[0].engine;
      form.setValue("engine", firstEnabled);

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("engine", firstEnabled);
      router.replace(currentUrl.toString(), { scroll: false });
    }
  }, [enabledEngines, form, router]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Create search engine URL
    const url = new URL(engines.find((e) => e.engine === values.engine)!.url);
    url.searchParams.append("q", values.search);

    // Update current URL params for history/sharing
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("q", values.search);
    currentUrl.searchParams.set("engine", values.engine);
    router.replace(currentUrl.toString(), { scroll: false });

    // Navigate to the search engine
    window.location.href = url.toString();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row w-full container justify-center gap-2"
      >
        <div className="flex flex-row space-x-0">
          <FormField
            control={form.control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <SelectTrigger className="h-11 rounded-e-none w-[5.5em]">
                      <SelectValue placeholder="?" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[6em]">
                      {enabledEngines.map((engine) => (
                        <SelectItem key={engine.engine} value={engine.engine}>
                          <Image
                            src={
                              theme === "dark" && engine.darkImage
                                ? engine.darkImage
                                : engine.image
                            }
                            alt={engine.engine}
                            width={24}
                            height={24}
                            className="h-5 w-auto"
                            onClick={() => {
                              field.onChange({
                                target: { value: engine.engine },
                              });

                              const currentUrl = new URL(window.location.href);
                              const currentQuery = form.getValues("search");
                              currentUrl.searchParams.set(
                                "engine",
                                engine.engine
                              );
                              if (currentQuery) {
                                currentUrl.searchParams.set("q", currentQuery);
                              }
                              router.replace(currentUrl.toString(), {
                                scroll: false,
                              });
                            }}
                          />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    showClearButton
                    className="w-[250px] md:w-[400px] lg:w-[500px] h-11 rounded-s-none text-lg"
                    placeholder="Enter something to search..."
                    autoFocus
                    {...field}
                    /* Remove the onChange handler that updates URL with every keystroke */
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="h-11 w-11"
        >
          <SearchIcon />
        </Button>
      </form>
    </Form>
  );
};

export default BrowserBar;

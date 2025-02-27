"use client";

import React, { useState, useEffect } from "react";
import ExportedImage from "next-image-export-optimizer";
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
import { Engine } from "../../types";

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
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const enabledEngines = getEnabledEngines();

  // Handle mounting state for theme hydration
  useEffect(() => {
    setMounted(true);
  }, []);

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

    // Update form engine value if the current one is disabled
    const currentEngine = form.getValues("engine");
    const isCurrentEngineEnabled = enabledEngines.some(
      (e) => e.engine === currentEngine
    );
    if (!isCurrentEngineEnabled) {
      form.setValue("engine", enabledEngines[0].engine);
    }
  }, [enabledEngines, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const engine = engines.find((e) => e.engine === values.engine);
    if (!engine) return;

    let url = engine.url.replace(
      "{searchTerm}",
      encodeURIComponent(values.search)
    );
    window.location.href = url;
  }

  // Check if the current theme is dark (using resolvedTheme to detect system preference)
  const isDarkTheme = mounted && resolvedTheme === "dark";

  // Helper function to get the correct image source based on theme
  const getEngineSrc = (engine: Engine) => {
    if (isDarkTheme && engine.darkImage) {
      return engine.darkImage;
    }
    return engine.image;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <div className="flex">
          <FormField
            control={form.control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger className="h-11 rounded-e-none w-[5.5em]">
                      <SelectValue placeholder="?" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[6em]">
                      {enabledEngines.map((engine) => (
                        <SelectItem key={engine.engine} value={engine.engine}>
                          <ExportedImage
                            src={getEngineSrc(engine)}
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

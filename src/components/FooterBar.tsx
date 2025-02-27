"use client";

import React from "react";
import ExportedImage from "next-image-export-optimizer";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, MoveVertical } from "lucide-react";

import {
  getEnginePreferences,
  saveEnginePreferences,
  updateEngineOrder,
  type EnginePreferences,
} from "@/lib/settings";
import { engines } from "@/lib/engines";
import { useTheme } from "next-themes";
import { DndProvider, SortableItem } from "./ui/dnd";
import { Engine } from "../../types";

const FooterBar = () => {
  const [preferences, setPreferences] = React.useState<EnginePreferences>({});
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("toggle");
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  const { theme, resolvedTheme } = useTheme();

  // Handle resolvedTheme hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setPreferences(getEnginePreferences());
  }, []);

  const handleToggle = (engine: string) => {
    setPreferences((prev) => ({
      ...prev,
      [engine]: {
        enabled: prev[engine] ? !prev[engine].enabled : true,
        order: prev[engine]?.order || 0,
      },
    }));
  };

  const handleSave = () => {
    saveEnginePreferences(preferences);
    setOpen(false);
    router.refresh();
  };

  // Get sorted engines for reordering view
  const sortedEngines = React.useMemo(() => {
    return engines
      .filter((engine) => preferences[engine.engine]?.enabled)
      .sort((a, b) => {
        const orderA = preferences[a.engine]?.order || 0;
        const orderB = preferences[b.engine]?.order || 0;
        return orderA - orderB;
      });
  }, [preferences]);

  const sortedEngineIds = sortedEngines.map((engine) => engine.engine);

  // Handle reordering
  const handleReorder = (reorderedIds: string[]) => {
    const updatedPrefs = { ...preferences };

    // Update order in preferences
    reorderedIds.forEach((engineId, index) => {
      if (updatedPrefs[engineId]) {
        updatedPrefs[engineId] = {
          ...updatedPrefs[engineId],
          order: index,
        };
      }
    });

    setPreferences(updatedPrefs);
  };

  // Check if the current theme is dark (either explicit or system-resolved)
  const isDarkTheme = mounted && resolvedTheme === "dark";

  const getEngineSrc = (engine: Engine): string => {
    if (mounted && isDarkTheme && engine.darkImage) {
      return engine.darkImage;
    }
    return engine.image;
  };

  return (
    <div className="w-full p-8 absolute bottom-0 left-0 justify-center items-center flex">
      <div className="container flex justify-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link">Settings</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Engine Settings</DialogTitle>
              <DialogDescription>
                Customize which search engines appear in your dropdown and their
                order.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="toggle"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-2"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="toggle">Enable/Disable</TabsTrigger>
                <TabsTrigger value="reorder">Reorder</TabsTrigger>
              </TabsList>

              <TabsContent value="toggle" className="py-4">
                <div className="flex flex-col gap-4">
                  {engines.map((engine) => {
                    const enabledCount = Object.values(preferences).filter(
                      (pref) => pref?.enabled
                    ).length;
                    const isLastEnabled =
                      preferences[engine.engine]?.enabled && enabledCount === 1;

                    return (
                      <div
                        key={engine.engine}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <ExportedImage
                            src={getEngineSrc(engine)}
                            alt={engine.engine}
                            width={24}
                            height={24}
                            className="h-5 w-auto"
                          />
                          <span className="capitalize">{engine.engine}</span>
                          {engine.notes && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-sm">
                                  {engine.notes}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>

                        <div className="relative">
                          {isLastEnabled && (
                            <div
                              className="absolute inset-0 z-10 flex items-center justify-center cursor-not-allowed"
                              title="At least one search engine must remain enabled"
                            >
                              <div className="h-full w-full opacity-0" />
                            </div>
                          )}
                          <Switch
                            checked={
                              preferences[engine.engine]?.enabled || false
                            }
                            onCheckedChange={() => handleToggle(engine.engine)}
                            disabled={isLastEnabled}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="reorder" className="py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Drag to reorder engines. The first engine will be your
                  default.
                </p>

                <DndProvider items={sortedEngineIds} onReorder={handleReorder}>
                  <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                    {sortedEngines.map((engine) => (
                      <SortableItem key={engine.engine} id={engine.engine}>
                        <ExportedImage
                          src={getEngineSrc(engine)}
                          alt={engine.engine}
                          width={24}
                          height={24}
                          className="h-5 w-auto"
                        />
                        <span className="capitalize">{engine.engine}</span>
                        {engine.notes && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs text-sm">
                                {engine.notes}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </SortableItem>
                    ))}
                  </div>
                </DndProvider>
                {sortedEngines.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">
                    No engines enabled. Enable engines in the Enable/Disable tab
                    first.
                  </p>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save preferences</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FooterBar;

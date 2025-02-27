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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

import {
  getEnginePreferences,
  saveEnginePreferences,
  type EnginePreferences,
} from "@/lib/settings";
import { engines } from "@/lib/engines";
import { useTheme } from "next-themes";

const FooterBar = () => {
  const [preferences, setPreferences] = React.useState<EnginePreferences>({});
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const { theme } = useTheme();

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

  return (
    <div className="w-full p-8 absolute bottom-0 left-0 justify-center items-center flex">
      <div className="container flex justify-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="text-xs hover:underline font-medium">
            Settings
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Engine Settings</DialogTitle>
              <DialogDescription>
                Choose which search engines you want to see in the dropdown.
                Your preferences will be saved in your browser.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
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
                        src={
                          theme === "dark" && engine.darkImage
                            ? engine.darkImage
                            : engine.image
                        }
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
                        checked={preferences[engine.engine]?.enabled || false}
                        onCheckedChange={() => handleToggle(engine.engine)}
                        disabled={isLastEnabled}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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

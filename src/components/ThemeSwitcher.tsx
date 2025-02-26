"use client";

import { useState, useEffect, use } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleTheme = () => {
    if (theme == "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <div>
      <Button variant="outline" size="icon" onClick={handleTheme}>
        {theme == "light" ? <MoonIcon /> : <SunIcon />}
        <p className="sr-only">Switch Theme</p>
      </Button>
    </div>
  );
};

export default ThemeSwitcher;

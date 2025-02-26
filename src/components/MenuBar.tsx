import React from "react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

const MenuBar = () => {
  return (
    <div className="w-full p-8 absolute top-0 left-0 justify-center items-center flex">
      <div className="container flex justify-end gap-4">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default MenuBar;

"use client";

import BrowserBar from "@/components/BrowserBar";
import FooterBar from "@/components/FooterBar";
import MenuBar from "@/components/MenuBar";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <MenuBar />
      <Suspense>
        <BrowserBar />
      </Suspense>
      <FooterBar />
    </div>
  );
}

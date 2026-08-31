"use client";

import { useState, type ReactNode } from "react";
import Preloader from "@/components/preloader/preloader";
import CustomCursor from "@/components/cursor/custom-cursor";
import ChatWidget from "@/components/chat/chat-widget";
import SmoothScroll from "./smooth-scroll";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Preloader onDone={() => setLoaded(true)} />
      <CustomCursor />
      <SmoothScroll enabled={loaded}>{children}</SmoothScroll>
      <ChatWidget />
    </>
  );
}

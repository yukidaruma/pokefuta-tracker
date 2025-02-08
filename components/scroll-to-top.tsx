"use client";

import { usePathname } from "next/navigation";
import React from "react";

const ScrollToTop: React.FC = () => {
  const pathname = usePathname();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

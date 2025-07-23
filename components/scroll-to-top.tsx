"use client";

import { usePathname } from "next/navigation";

import { useUpdateEffect } from "@/utils/hooks";

const ScrollToTop: React.FC = () => {
  const pathname = usePathname();

  // Scroll to top on route change (but not on initial load)
  useUpdateEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

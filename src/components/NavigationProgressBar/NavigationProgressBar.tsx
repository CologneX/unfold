"use client";

import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NavigationProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Start the progress bar when the pathname changes
    nprogress.start();

    // Stop the progress bar when the pathname changes

    // const timer = setTimeout(() => {
    //   nprogress.complete();

    //   setTimeout(() => {
    //     nprogress.reset();
    //   }, 200);
    // }, 500);

    // return () => clearTimeout(timer);
    return () => {
      nprogress.complete();
        // setTimeout(() => {
        //     nprogress.reset();
        // }, 200);
    };
  }, [pathname]);
  return <NavigationProgress />;
}

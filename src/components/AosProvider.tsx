"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "aos/dist/aos.css";

export default function AosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Dynamically import and initialize AOS after initial client hydration
    let isMounted = true;

    import("aos").then((module) => {
      if (isMounted) {
        module.default.init({
          duration: 650,
          once: true,
          easing: "ease-out-cubic",
          offset: 40,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    import("aos").then((module) => {
      module.default.refresh();
    });
  }, [pathname]);

  return <>{children}</>;
}

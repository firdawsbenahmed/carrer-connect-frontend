"use client";

import { usePathname } from "next/navigation";
import NavBar from "../../components/NavBar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavBar = pathname !== "/"; // Only show NavBar if not on landing page

  return (
    <>
      {showNavBar && <NavBar />}
      {children}
    </>
  );
}

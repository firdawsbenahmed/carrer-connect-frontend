import type React from "react";
import NavBar from "../../../../components/NavBar";

export default function CVDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='sticky top-0 z-40 border-b bg-background'>
        <div className='container flex h-16 items-center justify-between py-4'>
          <NavBar />
        </div>
      </header>
      <main className='flex-1'>{children}</main>
    </div>
  );
}

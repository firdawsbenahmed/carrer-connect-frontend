import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "../../components/toaster";
import { CandidatesProvider } from "../../context/candidates-context";
import { ClientLayout } from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "Career Connect",
  description: "Discover Your Perfect Career Path",
  icons: {
    icon: "/bag.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning>
        <CandidatesProvider>
          <ClientLayout>{children}</ClientLayout>
        </CandidatesProvider>
        <Toaster />
      </body>
    </html>
  );
}

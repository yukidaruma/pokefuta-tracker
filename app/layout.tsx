import type { Metadata } from "next";

import "./globals.css";
import HeaderComponent from "@/components/header";
import ClientPageRootComponent from "@/components/client-page-root";

export const metadata: Metadata = {
  title: "Pokéfuta Tracker",
  description: "Gotta catch 'em all!",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <ClientPageRootComponent>
        <HeaderComponent />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </ClientPageRootComponent>
    </div>
  );
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;

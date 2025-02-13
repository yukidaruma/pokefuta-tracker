import type { Metadata, Viewport } from "next";

// Order of these CSS imports is important
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

import "@/i18n";
import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import ClientPageRootComponent from "@/components/client-page-root";
import ScrollToTop from "@/components/scroll-to-top";
import { SearchProvider } from "@/providers/search";

export const metadata: Metadata = {
  title: "Pokéfuta Tracker",
  description: "ポケふたの訪問記録アプリ",
};

export const viewport: Viewport = {
  themeColor: "#e7000b",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientPageRootComponent>
        {/* Fix scrolling position with sticky header https://github.com/vercel/next.js/issues/45187#issuecomment-1639518030 */}
        <ScrollToTop />
        <HeaderComponent />
        <SearchProvider>
          <main className="w-full max-w-screen-xl mx-auto overflow-auto xl:my-8 xl:rounded-xl p-4 xl:p-8 bg-white flex flex-1">
            {children}
          </main>
        </SearchProvider>
        <FooterComponent />
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

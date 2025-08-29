import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { use } from "react";
import { Outlet } from "react-router-dom";

// Order of these CSS imports is important
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.css";
import "../globals.css";

import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import ClientPageRootComponent from "@/components/client-page-root";
import ScrollToTop from "@/components/scroll-to-top";
import { locales } from "@/i18n/constants";
import { SearchProvider } from "@/providers/search";
import { WishlistProvider } from "@/providers/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(locale, ["common"]);

  return {
    title: "Pokéfuta Tracker",
    description: t("app_description"),
  };
}

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientPageRootComponent>
        {/* Fix scrolling position with sticky header https://github.com/vercel/next.js/issues/45187#issuecomment-1639518030 */}
        <ScrollToTop />
        <HeaderComponent />
        <WishlistProvider>
          <SearchProvider>
            <main className="w-full max-w-screen-xl mx-auto overflow-auto xl:my-8 xl:rounded-xl p-4 xl:p-8 bg-white flex flex-1">
              <Outlet />
            </main>
          </SearchProvider>
        </WishlistProvider>
        <FooterComponent />
      </ClientPageRootComponent>
    </div>
  );
};

const RootLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default RootLayout;

import * as Mantine from "@mantine/core";
import { KeyPrefix } from "i18next";
import * as Lucide from "lucide-react";
import React from "react";

import HelpContent from "@/components/help-content";
import Link from "@/components/link";
import MantineModal from "@/components/modal";
import { useTranslation } from "@/i18n/client";
import { usePathname } from "@/utils/hooks";

type NavItem = {
  href: string;
  icon: React.ElementType;
  labelKey: KeyPrefix<"common">;
};
export const navItems: NavItem[] = [
  { href: "/", icon: Lucide.List, labelKey: "title_list" },
  { href: "/map", icon: Lucide.Map, labelKey: "title_map" },
  { href: "/progress", icon: Lucide.BarChart2, labelKey: "title_progress" },
  { href: "/settings", icon: Lucide.Settings, labelKey: "title_settings" },
];

const HeaderComponent: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}/, "") || "/";

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);

  const header = (
    <header className="bg-red-600 p-4 flex items-center sticky top-0 z-10">
      <Mantine.Tooltip label={t("menu" as any)}>
        <Mantine.Burger
          color="white"
          opened={isSidebarOpen}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        />
      </Mantine.Tooltip>
      <Link href="/">
        <h1 className="ml-4 text-white text-2xl font-bold">Pokéfuta Tracker</h1>
      </Link>
      <div className="ml-auto">
        <Mantine.Tooltip label={t("help" as any)}>
          <Mantine.ActionIcon
            color="white"
            variant="transparent"
            onClick={() => setIsHelpModalOpen(true)}
            size="lg"
          >
            <Lucide.HelpCircle size={24} />
          </Mantine.ActionIcon>
        </Mantine.Tooltip>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isSidebarOpen ? "opacity-60" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
    </header>
  );

  return (
    <>
      {header}

      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="min-w-[16em] py-4">
          {navItems.map((item) => {
            const isCurrentPage =
              pathWithoutLocale === item.href ||
              (item.href !== "/" && pathWithoutLocale.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isCurrentPage ? "bg-red-50 text-red-700" : ""
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    color={isCurrentPage ? "#b91c1c" : "gray"}
                    className="h-6 w-6 mr-4"
                  />
                  <span>{t(item.labelKey as any)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <MantineModal
        opened={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        withCloseButton={false}
        styles={{
          body: { paddingLeft: 24, paddingRight: 24 },
        }}
        size="xl"
      >
        <HelpContent onClose={() => setIsHelpModalOpen(false)} />
      </MantineModal>
    </>
  );
};

export default HeaderComponent;

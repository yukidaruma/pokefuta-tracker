"use client";

import * as Lucide from "lucide-react";
import * as Mantine from "@mantine/core";
import React from "react";

import HelpContent from "@/components/help-content";
import Link from "@/components/link";
import MantineModal from "@/components/modal";
import { useTranslation } from "@/i18n/client";

const HeaderComponent: React.FC = () => {
  const { t } = useTranslation();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
  const navItems = [
    { href: "/", icon: Lucide.List, label: t("title_list") },
    { href: "/map", icon: Lucide.Map, label: t("title_map") },
    { href: "/progress", icon: Lucide.BarChart2, label: t("title_progress") },
    { href: "/settings", icon: Lucide.Settings, label: t("title_settings") },
  ];

  return (
    <header className="bg-red-600 p-4 flex items-center sticky top-0 z-[1000]">
      <Mantine.Burger
        color="white"
        opened={isSidebarOpen}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      />
      <Link href="/">
        <h1 className="ml-4 text-white text-2xl font-bold">Pokéfuta Tracker</h1>
      </Link>
      <div className="ml-auto">
        <Mantine.ActionIcon
          color="white"
          variant="transparent"
          onClick={() => setIsHelpModalOpen(true)}
          size="lg"
        >
          <Lucide.HelpCircle size={24} />
        </Mantine.ActionIcon>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isSidebarOpen ? "opacity-60" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="min-w-[16em] py-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon color="gray" className="h-6 w-6 mr-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
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
        <HelpContent />
      </MantineModal>
    </header>
  );
};

export default HeaderComponent;

import { useTranslation } from "@/i18n-client";
import { fallbackLng } from "@/i18n/constants";
import NextLink from "next/link";
import React from "react";

const Link: React.FC<React.ComponentProps<typeof NextLink>> = (props) => {
  const { i18n } = useTranslation();
  const { href, children, ...rest } = props;

  const langPrefix = i18n.language === fallbackLng ? "" : `/${i18n.language}`;

  return (
    <NextLink href={`${langPrefix}${href}`} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;

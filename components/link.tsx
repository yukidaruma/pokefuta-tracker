import { useTranslation } from "@/i18n-client";
import NextLink from "next/link";
import React from "react";

const Link: React.FC<React.ComponentProps<typeof NextLink>> = (props) => {
  const { i18n } = useTranslation();
  const { href, children, ...rest } = props;

  return (
    <NextLink href={`/${i18n.language}${href}`} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;

import React from "react";

import { useTranslation } from "@/i18n/client";

const Link: React.FC<React.ComponentProps<"a">> = (props) => {
  const { i18n } = useTranslation();
  const { href, children, ...rest } = props;

  return (
    <a href={`/${i18n.language}${href}`} {...rest}>
      {children}
    </a>
  );
};

export default Link;

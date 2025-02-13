import Link from "next/link";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">Not Found</h2>

      <p className="mt-4">{t("error_not_found")}</p>

      <p className="mt-4">
        <Link className="text-blue-500 hover:underline" href="/">
          {t("back_to_top_page")}
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;

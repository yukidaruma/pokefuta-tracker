"use client";

import Link from "@/components/link";

// Importing `useTranslation` from this file will cause an error.

const NotFoundPage: React.FC = async () => {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">Not Found</h2>

      <p className="mt-4">Page not found</p>

      <p className="mt-4">
        <Link className="text-blue-500 hover:underline" href="/">
          Return to home
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;

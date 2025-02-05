import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl text-red-700 font-bold">Not Found</h2>

      <p className="mt-4">ページが見つかりません</p>

      <p className="mt-4">
        <Link className="text-blue-500 hover:underline" href="/">
          トップページに戻る
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;

"use client";

import Image from "next/image";
import Link from "next/link";
import logoMovie from "@/app/assets/images/logo-movie.png";
import logoBook from "@/app/assets/images/logo-book.png";
import { useLanguage } from "@/app/i18n/language-context";

export default function HomePage(): React.JSX.Element {
  const { language } = useLanguage();

  const handleToggleLanguage = (): void => {
    const nextLanguage = language === "zh" ? "en" : "zh";
    window.localStorage.setItem("mood-labs-language", nextLanguage);
    window.location.reload();
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgb(255 204 224 / 15%) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgb(196 225 231 / 20%) 0%, transparent 45%), linear-gradient(160deg, #1e1220 0%, #1a1a2e 50%, #162030 100%)"
      }}
      className="min-h-screen"
    >
      <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
        <header className="mb-16 flex h-16 items-center justify-between rounded-2xl bg-white/10 px-5 shadow-sm backdrop-blur-sm">
          <span className="text-xl font-semibold text-white">MoodLabs</span>
          <button
            type="button"
            onClick={handleToggleLanguage}
            className="cursor-pointer bg-transparent p-2 text-sm font-medium text-white opacity-90 transition-opacity hover:opacity-100"
          >
            {language === "zh" ? "En" : "中文"}
          </button>
        </header>

        <section className="flex flex-col items-center text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl nunito">
            {language === "zh" ? "你今天心情如何？" : "How are you feeling today?"}
          </h1>
          <p className="mb-14 text-lg text-white/70">
            {language === "zh"
              ? "选择一个类型，让心情带你发现好内容"
              : "Pick a category and let your mood guide you"}
          </p>

          <div className="grid w-full max-w-xl grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              href="/movie"
              className="group flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-8 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-[1.03] hover:shadow-lg"
            >
              <Image src={logoMovie} alt="Movie" width={56} height={56} />
              <div>
                <p className="text-xl font-semibold text-white">
                  {language === "zh" ? "电影" : "Movies"}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {language === "zh" ? "根据心情邂逅高分佳片" : "Discover top-rated films for your mood"}
                </p>
              </div>
            </Link>

            <Link
              href="/book"
              className="group flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-8 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-[1.03] hover:shadow-lg"
            >
              <Image src={logoBook} alt="Book" width={56} height={56} />
              <div>
                <p className="text-xl font-semibold text-white">
                  {language === "zh" ? "书籍" : "Books"}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {language === "zh" ? "根据心情邂逅宝藏书籍" : "Find great books that match how you feel"}
                </p>
              </div>
            </Link>
          </div>
        </section>

        <footer className="mt-16 text-center text-sm text-white/50">
          Created By{" "}
          <a
            href="https://x.com/shuzai_dd"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            shuzai_daydreaming
          </a>
          , Inspired By{" "}
          <a
            href="https://mood2movie.com"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            mood2movie.com
          </a>
          .
        </footer>
      </main>
    </div>
  );
}

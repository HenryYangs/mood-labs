"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/i18n/language-context";
import { moodLabels } from "@/types/mood";
import { useEffect, useMemo, useState } from "react";

type MovieHeaderProps = {
  logo: StaticImageData;
  showChangeMoodButton?: boolean;
  title?: string;
  changeMoodHref?: string;
  changeMoodButtonClassName?: string;
};

export default function MovieHeader({
  logo,
  showChangeMoodButton = false,
  title = "MoodLabs/Movie",
  changeMoodHref = "/movie",
  changeMoodButtonClassName = "bg-linear-to-r from-[#b13a47] to-[#c9464f] hover:from-[#ff0030] hover:to-[#ff1a3d]"
}: MovieHeaderProps): React.JSX.Element {
  const { language } = useLanguage();
  const moodEmojis = useMemo(() => moodLabels.map((item) => item.emoji), []);
  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const changeMoodLabel = language === "zh" ? "修改心情" : "Edit mood";

  useEffect(() => {
    if (!showChangeMoodButton || moodEmojis.length <= 1) {
      return;
    }

    let timer: number | undefined;

    const tick = (): void => {
      timer = window.setTimeout(() => {
        setEmojiIndex((prev) => (prev + 1) % moodEmojis.length);
        tick();
      }, 1000);
    };

    tick();

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [showChangeMoodButton, moodEmojis.length]);

  const handleToggleLanguage = (): void => {
    const nextLanguage = language === "zh" ? "en" : "zh";
    window.localStorage.setItem("mood-labs-language", nextLanguage);
    window.location.reload();
  };

  return (
    <header className="mb-8 flex h-16 items-center rounded-2xl bg-(--movie-surface) px-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-1 items-center">
        <Image src={logo} alt="MoodLabs" width={32} height={32} />
      </div>

      <div className="flex items-center justify-center px-2 text-center">
        <span className="text-xl font-semibold text-white">{title}</span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {showChangeMoodButton ? (
          <Button
            asChild
            size="sm"
            className={`h-12 rounded-xl bg-linear-to-r px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:text-white ${changeMoodButtonClassName}`}
          >
            <Link href={changeMoodHref} className="inline-flex items-center gap-2">
              <span className="inline-flex w-5 items-center justify-center">
                {moodEmojis[emojiIndex] ?? "🙂"}
              </span>
              <span>{changeMoodLabel}</span>
            </Link>
          </Button>
        ) : null}

        <button
          type="button"
          onClick={handleToggleLanguage}
          className="cursor-pointer bg-transparent p-2 text-sm font-medium text-white opacity-90 transition-opacity hover:opacity-100"
        >
          {language === "zh" ? "En" : "中文"}
        </button>

      </div>
    </header>
  );
}

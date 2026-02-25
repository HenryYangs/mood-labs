"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/images/logo-movie.png";
import { Button } from "@/components/ui/button";
import { moodLabels } from "@/types/mood";
import { useEffect, useMemo, useState } from "react";

type MovieHeaderProps = {
  showChangeMoodButton?: boolean;
  title?: string;
};

export default function MovieHeader({
  showChangeMoodButton = false,
  title = "MoodLabs/Movie"
}: MovieHeaderProps): React.JSX.Element {
  const moodEmojis = useMemo(() => moodLabels.map((item) => item.emoji), []);
  const [emojiIndex, setEmojiIndex] = useState<number>(0);

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

  return (
    <header className="relative mb-8 h-16 rounded-2xl bg-(--movie-surface) px-5 shadow-sm backdrop-blur-sm">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
        <Image src={logo} alt="MoodLabs" width={32} height={32} />
      </span>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <span className="text-xl font-semibold text-white">{title}</span>
      </div>
      {showChangeMoodButton ? (
        <Button
          asChild
          size="sm"
          className="absolute right-5 top-1/2 h-12 -translate-y-1/2 rounded-xl bg-linear-to-r from-[#b13a47] to-[#c9464f] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#ff0030] hover:to-[#ff1a3d] hover:text-white"
        >
          <Link href="/movie" className="inline-flex items-center gap-2">
            <span className="inline-flex w-5 items-center justify-center">
              {moodEmojis[emojiIndex] ?? "🙂"}
            </span>
            <span>修改心情</span>
          </Link>
        </Button>
      ) : null}
    </header>
  );
}

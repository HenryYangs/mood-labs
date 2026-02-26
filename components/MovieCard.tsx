import { useRef, useState } from "react";
import { useLanguage } from "@/app/i18n/language-context";
import type { Movie } from "@/types/movie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MovieCardProps = {
  movie: Movie;
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
};

function getYoutubeEmbedUrl(url: string | undefined): string {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  } catch {
    return url;
  }
}

export default function MovieCard({
  movie,
  currentIndex,
  total,
  onPrev,
  onNext,
  disablePrev,
  disableNext
}: MovieCardProps): React.JSX.Element {
  const { language } = useLanguage();
  const embedUrl = getYoutubeEmbedUrl(movie.source?.url);
  const displayRating = movie.source?.rating ?? movie.rating ?? "N/A";
  const displayDuration =
    movie.duration ? `${movie.duration} ${language === "zh" ? "分钟" : "min"}` : "N/A";
  const displayDate = movie.date ?? (movie.year ? String(movie.year) : "N/A");
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const handleTitleMouseMove = (event: React.MouseEvent<HTMLHeadingElement>): void => {
    if (!tooltipRef.current) {
      return;
    }
    tooltipRef.current.style.left = `${event.clientX}px`;
    tooltipRef.current.style.top = `${event.clientY - 10}px`;
  };

  const handleCopyTitle = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(movie.title);
      window.alert(language === "zh" ? "复制成功" : "Copied");
    } catch {
      window.alert(language === "zh" ? "复制失败，请重试" : "Copy failed, please try again.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl">
      {embedUrl ? (
        <div className="mx-auto w-full h-[380px] overflow-hidden bg-zinc-100/80">
          <iframe
            src={embedUrl}
            title={`${movie.title} trailer`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : null}

      <div className="space-y-5 bg-(--movie-surface) p-5">
        <div className="space-y-2">
          <h2
            className="cursor-pointer text-2xl font-semibold text-white"
            onMouseEnter={(): void => {
              setTooltipVisible(true);
            }}
            onMouseMove={handleTitleMouseMove}
            onMouseLeave={(): void => {
              setTooltipVisible(false);
            }}
            onClick={(): void => {
              void handleCopyTitle();
            }}
          >
            {movie.title}
          </h2>
          <div className="space-y-1 text-sm text-white/85">
            <p>{language === "zh" ? "上映时间" : "Release"}: {displayDate}</p>
            <p>{language === "zh" ? "时长" : "Duration"}: {displayDuration}</p>
            <p>{language === "zh" ? "评分" : "Rating"}: {displayRating}</p>
          </div>
        </div>

        {movie.source?.tag?.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {movie.source.tag.map((item) => (
              <Badge
                key={`${movie.title}-${item}`}
                variant="outline"
                className="border-zinc-200 bg-zinc-100 text-zinc-700"
              >
                {item}
              </Badge>
            ))}
          </div>
        ) : null}

        {movie.reason ? (
          <div>
            <p className="text-sm leading-relaxed text-zinc-300">{movie.reason}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={onPrev}
            disabled={disablePrev}
            className="h-12 cursor-pointer rounded-xl bg-linear-to-r from-[#b13a47] to-[#c9464f] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#ff0030] hover:to-[#ff1a3d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {language === "zh" ? "上一部" : "Previous"}
          </Button>

          <Button
            onClick={onNext}
            disabled={disableNext}
            className="h-12 cursor-pointer rounded-xl bg-linear-to-r from-[#b13a47] to-[#c9464f] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#ff0030] hover:to-[#ff1a3d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {language === "zh" ? "下一部" : "Next"}
          </Button>
        </div>
      </div>

      {tooltipVisible ? (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-xs text-white shadow-md"
        >
          {language === "zh" ? "点击复制电影标题" : "Click to copy movie title"}
        </div>
      ) : null}
    </div>
  );
}

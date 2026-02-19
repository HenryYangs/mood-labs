import { useRef, useState } from "react";
import type { Movie } from "@/types/movie";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  const embedUrl = getYoutubeEmbedUrl(movie.source?.url);
  const displayRating = movie.source?.rating ?? movie.rating ?? "N/A";
  const displayDuration = movie.duration ? `${movie.duration} min` : "N/A";
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
      window.alert("复制成功");
    } catch {
      window.alert("复制失败，请重试");
    }
  };

  return (
    <div className="space-y-5 overflow-hidden rounded-2xl bg-white/70 p-6 shadow-md backdrop-blur-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
        {embedUrl ? (
          <div className="mx-auto w-full max-w-[640px] h-[380px] overflow-hidden rounded-2xl bg-zinc-100/80">
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

        <div className="space-y-2">
          <h2
            className="cursor-pointer text-2xl font-semibold text-zinc-900"
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
          <div className="space-y-1 text-sm text-zinc-600">
            <p>上映时间: {displayDate}</p>
            <p>时长: {displayDuration}</p>
            <p>评分: {displayRating}</p>
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
          <div className="rounded-2xl bg-zinc-100/85 p-4">
            <p className="text-sm leading-relaxed text-zinc-700">{movie.reason}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onPrev} disabled={disablePrev}>
            上一部
          </Button>
          <Badge className="bg-white/85 text-zinc-700">
            {currentIndex + 1} / {total}
          </Badge>
          <Button variant="outline" onClick={onNext} disabled={disableNext}>
            下一部
          </Button>
        </div>

        <Separator />

        {tooltipVisible ? (
          <div
            ref={tooltipRef}
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-xs text-white shadow-md"
          >
            点击复制电影标题
          </div>
        ) : null}
    </div>
  );
}

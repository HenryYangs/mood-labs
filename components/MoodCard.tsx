import type { MoodLabel } from "@/types/mood";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MoodCardProps = {
  option: MoodLabel;
  onSelect: (mood: MoodLabel["mood"]) => void;
  displayLabel?: string;
};

export default function MoodCard({
  option,
  onSelect,
  displayLabel
}: MoodCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={(): void => onSelect(option.mood)}
      className="w-[220px] max-w-full cursor-pointer text-left transition-all duration-200 hover:scale-105"
    >
      <Card
        className={cn(
          "bg-(--movie-surface) backdrop-blur-xl transition-all duration-200 hover:shadow-lg ring-1 ring-white/60 shadow-md"
        )}
      >
        <CardContent className="flex items-center justify-center gap-2 p-5 text-center">
          <p className="text-2xl leading-none">{option.emoji}</p>
          <p className="whitespace-nowrap text-base font-medium text-white">
            {displayLabel ?? option.label}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}

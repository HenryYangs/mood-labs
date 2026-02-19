import type { MoodLabel } from "@/types/mood";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MoodCardProps = {
  option: MoodLabel;
  selected: boolean;
  onSelect: (mood: MoodLabel["mood"]) => void;
};

export default function MoodCard({ option, selected, onSelect }: MoodCardProps): React.JSX.Element {
  const glowClassByMood: Record<MoodLabel["mood"], string> = {
    happy: "shadow-amber-200/70",
    sad: "shadow-blue-200/70",
    romantic: "shadow-rose-200/70",
    excited: "shadow-pink-200/70",
    anxious: "shadow-orange-200/70",
    calm: "shadow-emerald-200/70"
  };

  return (
    <button
      type="button"
      onClick={(): void => onSelect(option.mood)}
      className="w-[220px] max-w-full cursor-pointer text-left transition-all duration-200 hover:scale-105"
    >
      <Card
        className={cn(
          "bg-white/70 backdrop-blur-xl transition-all duration-200 hover:shadow-lg",
          selected
            ? cn("ring-2 ring-violet-400 shadow-lg", glowClassByMood[option.mood])
            : "ring-1 ring-white/60 shadow-md"
        )}
      >
        <CardContent className="space-y-2 p-5">
          <p className="text-2xl leading-none">{option.emoji}</p>
          <p className="text-base font-medium text-zinc-900">{option.label}</p>
        </CardContent>
      </Card>
    </button>
  );
}

import type { MoodLabel } from "@/types/mood";

type MoodCardProps = {
  option: MoodLabel;
  selected: boolean;
  onSelect: (mood: MoodLabel["mood"]) => void;
};

export default function MoodCard({ option, selected, onSelect }: MoodCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={(): void => onSelect(option.mood)}
      className={`w-full rounded-3xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-purple-400 bg-softPurple shadow-md"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-sm"
      }`}
    >
      <p className="text-2xl">{option.emoji}</p>
      <p className="mt-2 text-base font-semibold">{option.label}</p>
    </button>
  );
}

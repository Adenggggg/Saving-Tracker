import { Search } from "lucide-react";

export function MemberSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm">
      <Search size={18} color="#8a8a8a" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search members by name or email..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
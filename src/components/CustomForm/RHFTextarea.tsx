import { type Control, Controller } from "react-hook-form";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";

interface RHFTextareaProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function RHFTextarea({ name, control, label, error, placeholder, disabled = false, rows = 3 }: RHFTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={`${disabled ? "text-purple-400/40" : "text-purple-200"}`}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder || label}
            rows={rows}
            disabled={disabled}
            className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg shadow-purple-900/20 resize-none ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        )}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

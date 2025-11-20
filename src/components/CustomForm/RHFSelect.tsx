import { type Control, Controller } from "react-hook-form";
import { Label } from "../ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";

interface RHFSelectProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function RHFSelect({ name, control, label, error, placeholder, options, disabled = false }: RHFSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={`${disabled ? "text-purple-400/40" : "text-purple-200"}`}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg shadow-purple-900/20 ${
                error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder={placeholder || label} />
            </SelectTrigger>
            <SelectContent className="bg-[#1a0d2e] border-purple-500/30 text-white">
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="focus:bg-purple-900/30 focus:text-white cursor-pointer hover:bg-purple-900/20"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

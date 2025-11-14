import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

interface RHFInputProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
}

export function RHFInput({ name, control, label, type = "text", error, placeholder }: RHFInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-purple-200">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder || label}
            className={`bg-[#1a0d2e]/50 border-purple-500/30 text-white placeholder:text-purple-400/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-lg shadow-purple-900/20 ${
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
          />
        )}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

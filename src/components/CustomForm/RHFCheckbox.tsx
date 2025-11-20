import { type Control, Controller } from "react-hook-form";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";

interface RHFCheckboxProps {
  name: string;
  control: Control<any>;
  label: string | React.ReactNode;
  error?: string;
  disabled?: boolean;
}

export function RHFCheckbox({ name, control, label, error, disabled = false }: RHFCheckboxProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={`border-purple-500/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600 data-[state=checked]:border-purple-500 ${
                error ? "border-red-500" : ""
              }`}
            />
          )}
        />
        <Label 
          htmlFor={name} 
          className={`text-purple-200 cursor-pointer ${disabled ? "opacity-50" : ""}`}
        >
          {label}
        </Label>
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

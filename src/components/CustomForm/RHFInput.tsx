import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input, type InputProps } from "../ui/Input";

export interface RHFInputProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, "name"> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  error?: string;
}

export function RHFInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  error,
  ...rest
}: RHFInputProps<TFieldValues>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={label}
            value={(field.value as any) ?? ""}
            hasError={Boolean(error)}
            {...rest}
          />
        )}
      />

      {error && <p className="mt-1 text-sm text-red-400 font-semibold">{error}</p>}
    </div>
  );
}

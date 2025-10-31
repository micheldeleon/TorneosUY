import { Controller } from "react-hook-form";

interface Props {
    name: string;
    control: any;
    label: string;
    type?: string;
    error?: string;
}

export const InputForm = ({ name, control, label, type = "text", error }: Props) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-white mb-2"
            >
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        type={type}
                        id={name}
                        placeholder={label}
                        value={field.value ?? ''}
                        className={`w-full px-4 py-3 rounded-md font-medium outline-none transition-all
              ${error
                                ? "bg-red-100 border-2 border-red-500 placeholder-red-400 text-red-700 focus:ring-2 focus:ring-red-500"
                                : "bg-[#d9d9f3] border-2 border-transparent text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-[#1e1e5a]"
                            }`}
                    />
                )}
            />

            {error && (
                <p className="mt-1 text-sm text-red-400 font-semibold">{error}</p>
            )}
        </div>
    );
};


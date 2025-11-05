import React, { useEffect, useMemo, useState } from "react";
import type { UserDetails } from "../../../models/userDetails.model";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema as detailsSchema, type FormValueDetails } from "./details.form.model";
import { Button } from "../Button";

export interface DescriptionListProps extends React.FormHTMLAttributes<HTMLFormElement> {
  data?: UserDetails | null;
  dense?: boolean;
  className?: string;
  onValidSubmit?: (values: FormValueDetails) => void;
}

export const DescriptionList: React.FC<DescriptionListProps> = ({
  data,
  dense = true,
  className = "",
  onValidSubmit,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const defaults: FormValueDetails | null = useMemo(() => {
    if (!data) return null;
    return {
      name: data.name ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      dateOfBirth: data.dateOfBirth ?? "",
      nationalId: data.nationalId ?? "",
      phoneNumber: data.phoneNumber ?? "",
      address: data.address ?? "",
      departmentId: data.departmentId,
    };
  }, [data]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValueDetails>({
    resolver: zodResolver(detailsSchema),
    defaultValues: defaults ?? undefined,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (defaults) reset(defaults);
  }, [defaults, reset]);

  const onSubmit: SubmitHandler<FormValueDetails> = (values) => {
    onValidSubmit?.(values);
    if (!onValidSubmit) console.log("Detalles enviados:", values);
    setIsEditing(false);
  };

  if (!data || !defaults) {
    // Render mínimo para no romper si todavía no hay data
    return <form className={className} {...props}>Cargando...</form>;
  }

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)} {...props}>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Nombre</label>
        <div className="w-2/3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.name && (
            <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Apellido</label>
        <div className="w-2/3">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.lastName && (
            <p className="text-xs text-rose-600 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Email</label>
        <div className="w-2/3">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                type="email"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.email && (
            <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Fecha de nacimiento</label>
        <div className="w-2/3">
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-rose-600 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">CI</label>
        <div className="w-2/3">
          <Controller
            name="nationalId"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.nationalId && (
            <p className="text-xs text-rose-600 mt-1">{errors.nationalId.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Teléfono</label>
        <div className="w-2/3">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-rose-600 mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Dirección</label>
        <div className="w-2/3">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.address && (
            <p className="text-xs text-rose-600 mt-1">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm font-semibold opacity-80 mr-4 w-1/3">Departamento</label>
        <div className="w-2/3">
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                readOnly={!isEditing}
                className="text-sm border border-slate-300 rounded px-2 py-1 w-full"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
              />
            )}
          />
          {errors.departmentId && (
            <p className="text-xs text-rose-600 mt-1">{errors.departmentId.message}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => {
            if (isEditing) reset(defaults);
            setIsEditing((v) => !v);
          }}
        >
          {isEditing ? "Cancelar" : "Modificar"}
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={!isEditing}>
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default DescriptionList;

import React, { useEffect, useMemo, useState } from "react";
import type { UserDetails } from "../../../models/userDetails.model";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { schema as detailsSchema, type FormValueDetails } from "./details.form.model";
import { Button } from "../Button";
import { updateUserDetails } from "../../../services/api.service";

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

  const toDateInputValue = (isoString: string) => {
    if (!isoString) return "";
    return isoString.split("T")[0]; // corta antes de la T → "2002-11-11"
  };

  const defaults: FormValueDetails | null = useMemo(() => {
    if (!data) return null;
    return {
      name: data.name ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      dateOfBirth: toDateInputValue(data.dateOfBirth) ?? "",
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
    watch,
  } = useForm<FormValueDetails>({
    resolver: zodResolver(detailsSchema),
    defaultValues: defaults ?? undefined,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (defaults) reset(defaults);
  }, [defaults, reset]);

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValueDetails> = async (values) => {
    setServerError(null); // limpio errores antes de enviar

    try {
      if (!data?.id) {
        setServerError("El ID del usuario no está disponible");
        return;
      }

      const userToUpdate = { ...values, id: data.id };
      const { call } = updateUserDetails(userToUpdate);

      const response = await call;

      console.log("Perfil actualizado:", response.data);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);

      // Si hay error del backend → lo mostramos
      if (error?.response?.data) {
        setServerError(error.response.data);
      } else {
        setServerError("Ocurrió un error inesperado");
      }
    }
  };


  if (!data || !defaults) {
    return <form className={className} {...props}>Cargando...</form>;
  }

  // observar valores requeridos para mostrar alerta - en futuro cambiar por boolean de usuario
  const [nameVal, lastNameVal, dobVal, ciVal, phoneVal] = watch([
    "name",
    "lastName",
    "dateOfBirth",
    "nationalId",
    "phoneNumber",
  ]);

  const isAnyRequiredEmpty =
    [nameVal, lastNameVal, dobVal, ciVal, phoneVal].some(
      (v) => v === undefined || v === null || String(v).trim() === ""
    );

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)} {...props}>

      {/* Alerta amarilla si falta algun campo requerido */}
      {isAnyRequiredEmpty && (
        <div
          role="alert"
          className="mb-4 rounded bg-surface-dark border-l-4 border-yellow-400 p-3 text-yellow-800 text-sm"

        >
          <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
          <p className="text-yellow-400">Si no completa los datos no podrá participar en torneos.</p>
        </div>
      )}

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm opacity-80 mr-4 w-1/3 text-white">Nombre</label>
        <div className="w-2/3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
                {...field}
              />
            )}
          />
          {errors.name && (
            <p className="text-white text-xs text-rose-600 mt-1">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className={`flex items-start ${dense ? "py-1" : "py-2"}`}>
        <label className="text-sm text-white opacity-80 mr-4 w-1/3">Apellido</label>
        <div className="w-2/3">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
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
        <label className="text-sm text-white opacity-80 mr-4 w-1/3">Fecha de nacimiento</label>
        <div className="w-2/3">
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
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
        <label className="text-sm text-white opacity-80 mr-4 w-1/3">CI</label>
        <div className="w-2/3">
          <Controller
            name="nationalId"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
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
        <label className="text-sm text-white opacity-80 mr-4 w-1/3">Teléfono</label>
        <div className="w-2/3">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
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
        <label className="text-sm text-white opacity-80 mr-4 w-1/3">Dirección</label>
        <div className="w-2/3">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
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
        <label className="text-sm text-white opacity-80 mr-4 w-1/3">Departamento</label>
        <div className="w-2/3">
          <Controller
            name="departmentId"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                readOnly={!isEditing}
                className="text-white text-sm border border-slate-300 rounded px-2 py-1 w-full"
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
      {serverError && (
        <div className="mb-4 rounded bg-red-900 border-l-4 border-red-500 p-3 text-red-300 text-sm">
          {serverError}
        </div>
      )}
    </form>

  );
};

export default DescriptionList;

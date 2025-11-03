import { schema, type FormValueRegister } from "../../components/CustomForm/schemas";
import { GoogleButton, Submit, RHFInput } from "../../components/CustomForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UserRegister } from "../../models/userRegister.model";
import { postRegister, type ApiResponse } from "../../services/api.service";
import { useApi } from "../../hooks/useApi";

const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValueRegister>({
    resolver: zodResolver(schema)
  });

  const { fetch, data, error, loading } = useApi<ApiResponse, UserRegister>(postRegister);
  const onSubmit: SubmitHandler<FormValueRegister> = async (formData) => {
    const { confirmPassword, ...user } = formData;
    fetch(user);
    console.log("Datos enviados:", user);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2a0b57] to-[#13215a]">
        <div className="w-full max-w-md px-8 py-12">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            Nombre APP
          </h1>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <RHFInput name="name" control={control} label="Nombre" error={errors.name?.message} />
            <RHFInput name="lastName" control={control} label="Apellido" type="text" error={errors.lastName?.message} />
            <RHFInput name="email" control={control} label="Email" error={errors.email?.message} />
            <RHFInput name="password" control={control} label="Contraseña" type="password" error={errors.password?.message} />
            <RHFInput name="confirmPassword" control={control} label="Confirmar contraseña" type="password" error={errors.confirmPassword?.message} />
            <Submit txt="INGRESAR" />
          </form>
          {data?.message}
          {error?.message}
          <GoogleButton text="G" />
        </div>
      </div>
    </>
  );
};

export default RegisterForm;


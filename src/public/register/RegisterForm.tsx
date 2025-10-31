import { schema, type FormValue } from '../../components/CustomForm/schemas';
import { GoogleButton, Submit, InputForm } from '../../components/CustomForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

const RegisterForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValue>({
    resolver: zodResolver(schema)
  });
  const onSubmit: SubmitHandler<FormValue> = (data) => {
    console.log(data);
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2a0b57] to-[#13215a]">
        <div className="w-full max-w-md px-8 py-12">
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            Nombre APP
          </h1>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
            <InputForm name="email" control={control} label="Email" error={errors.email?.message} />
            <InputForm name="password" control={control} label="Contraseña" type="text" error={errors.password?.message} />
            <InputForm name="email" control={control} label="Email" error={errors.password?.message} />
            <InputForm name="password" control={control} label="Contraseña" type="password" error={errors.password?.message} />
            <InputForm name="password" control={control} label="Confirmar contrasena" type="password" error={errors.password?.message} />
            <Submit txt="INGRESAR" />
            <GoogleButton text='G' />
          </form>


        </div >
      </div >
    </>
  );
}
export default RegisterForm;

{
  /* <form onSubmit={handleSubmit(onSubmit)}>
                <InputForm name="name" control={control} label="Nombre" error={errors.name?.message} />
                <InputForm name="lastName" control={control} label="Apellido" error={errors.lastName?.message} />
                <InputForm name="email" control={control} label="Email" error={errors.email?.message} />
                <InputForm name="password" control={control} label="Contraseña" type="password" error={errors.password?.message} />
                <InputForm name="confirmPassword" control={control} label="Confirmar Contraseña" type="password" error={errors.confirmPassword?.message} />
                <input type="submit" value="Enviar" />
            </form> */}
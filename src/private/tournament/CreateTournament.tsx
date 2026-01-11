import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { createTournamentSchema, type FormValueCreateTournament } from "../../components/CustomForm/schemas/createTournament.form.model";
import { RHFInput, RHFSelect, RHFCheckbox, Submit } from "../../components/CustomForm";
import { Eye, EyeOff, FileText, Info, Calendar, Users, DollarSign, Loader2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/Dialog";
import { useApi } from "../../hooks/useApi";
import type { CreateTournament } from "../../models/createTournament.model";
import { createTournament } from "../../services/api.service";
import { getDisciplines, getFormatsByDiscipline, getUsersByIdAndEmail } from "../../services/api.service";
import { useNavigate, Link } from "react-router-dom";
import type { UserDetails } from "../../models/userDetails.model";
import type { UserFind } from "../../models/userFind.model";
import type { TournamentCreated } from "../../models";
import { RHFRichTextEditor } from "../../components/CustomForm/RHFRichTextEditor";
import { Alert, AlertDescription } from "../../components/ui/Alert";
import { AlertCircle } from "lucide-react";
import { ImageUpload } from "../../components/ImageUpload";
import { uploadTournamentImage } from "../../services/imageUpload.service";

export default function CreateTournament() {

  const navigate = useNavigate();

  const { data: userData, fetch, loading: loadingUserData } = useApi<UserDetails, UserFind>(getUsersByIdAndEmail);

  const { data, fetch: createTournamentFetch } = useApi<TournamentCreated, { organizerId: number; tournament: CreateTournament }>(createTournament);

  const [tournamentImage, setTournamentImage] = useState<File | null>(null);
  const tournamentProcessedRef = useRef(false);

  // Llamar a la API al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    try {
      const user: UserFind = JSON.parse(storedUser);
      fetch(user);
    } catch (e) {
      console.error("JSON inválido en localStorage.user", e);
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors, isValid } } = useForm<FormValueCreateTournament>({
    resolver: zodResolver(createTournamentSchema),
    mode: "onChange",
    defaultValues: {
      discipline: "",
      format: "",
      name: "",
      registrationDeadline: "",
      startAt: "",
      endAt: "",
      minParticipantsPerTeam: 0,
      maxParticipantsPerTeam: 0,
      minParticipantsPerTournament: 0,
      maxParticipantsPerTournament: 0,
      registrationCost: 0,
      prize: "",
      detalles: "",
      isPrivate: false,
      password: "",
      isDoubleRound: false,
      acceptTerms: false,
    }
  });

  const selectedDiscipline = watch("discipline");
  const selectedFormat = watch("format");
  const registrationDeadline = watch("registrationDeadline");
  const startAt = watch("startAt");
  const endAt = watch("endAt");

  const { data: disciplinesData } = useApi(getDisciplines, { autoFetch: true });

  const { data: formatsData, fetch: fetchFormats } =
    useApi(getFormatsByDiscipline);

  // Verificar si el formato seleccionado es Liga
  const isLigaFormat = (() => {
    if (!selectedFormat || !formatsData) return false;
    const format = formatsData.find((f: any) => f.id.toString() === selectedFormat);
    return format?.name === "Liga";
  })();

  useEffect(() => {
    if (selectedDiscipline) {
      fetchFormats(selectedDiscipline);
    }
  }, [selectedDiscipline]);

  // Auto-setear valores para disciplinas no colectivas
  useEffect(() => {
    if (selectedDiscipline && disciplinesData) {
      const selectedDisciplineData = disciplinesData.find(
        (d: any) => d.id.toString() === selectedDiscipline
      );

      if (selectedDisciplineData && !selectedDisciplineData.collective) {
        setValue("minParticipantsPerTeam", 1);
        setValue("maxParticipantsPerTeam", 1);
      }
    }
  }, [selectedDiscipline, disciplinesData, setValue]);

  // Revalidar fechas cuando cambian
  useEffect(() => {
    if (registrationDeadline || startAt || endAt) {
      trigger(["registrationDeadline", "startAt", "endAt"]);
    }
  }, [registrationDeadline, startAt, endAt, trigger]);

  const disciplineOptions = Array.isArray(disciplinesData)
    ? disciplinesData.map(d => ({
      label: d.name,
      value: d.id.toString()
    }))
    : [];


  const formatOptions = Array.isArray(formatsData)
    ? formatsData.map(f => ({
      label: f.name,
      value: f.id.toString()
    }))
    : [];


  const [showPassword, setShowPassword] = useState(false);
  const [loading] = useState(false);

  // Verificar si faltan campos obligatorios del perfil
  const isProfileIncomplete = (() => {
    if (!userData) return true;
    const requiredFields = [
      userData.name,
      userData.lastName,
      userData.email,
      userData.dateOfBirth,
      userData.nationalId,
      userData.phoneNumber,
    ];
    return requiredFields.some((field) => !field || field.toString().trim() === "");
  })();

  const isPrivate = watch("isPrivate");
  const acceptTerms = watch("acceptTerms");

  const isDisciplineSelected = selectedDiscipline !== "";
  const isFormatSelected = selectedFormat !== "";

  const isCollectiveDiscipline = (() => {
    if (!selectedDiscipline || !disciplinesData) return false;
    const discipline = disciplinesData.find((d: any) => d.id.toString() === selectedDiscipline);
    return discipline?.collective ?? false;
  })();

  const onSubmit: SubmitHandler<FormValueCreateTournament> = async (formData) => {

    const user: UserFind = JSON.parse(localStorage.getItem("user")!);
    const organizerId = user.id;

    const payload: CreateTournament = {
      disciplineId: Number(formData.discipline),
      formatId: Number(formData.format),
      name: formData.name,
      startAt: new Date(formData.startAt).toISOString(),
      endAt: new Date(formData.endAt).toISOString(),
      registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
      privateTournament: formData.isPrivate,
      password: formData.isPrivate ? formData.password ?? null : null,
      minParticipantsPerTeam: Number(formData.minParticipantsPerTeam),
      maxParticipantsPerTeam: Number(formData.maxParticipantsPerTeam),
      minParticipantsPerTournament: Number(formData.minParticipantsPerTournament),
      maxParticipantsPerTournament: Number(formData.maxParticipantsPerTournament),
      registrationCost: Number(formData.registrationCost),
      prize: formData.prize,
      detalles: formData.detalles,
      isDoubleRound: formData.isDoubleRound,
    };

    createTournamentFetch({ organizerId, tournament: payload });
  };

  useEffect(() => {
    // Evitar procesar múltiples veces el mismo torneo
    if (!data || tournamentProcessedRef.current) return;
    
    const processCreatedTournament = async () => {
      if (data?._status === 200 || data?._status === 201) {
        tournamentProcessedRef.current = true;
        
        // Si hay una imagen, subirla DESPUÉS de crear el torneo
        if (tournamentImage && data.id) {
          try {
            await uploadTournamentImage(data.id, tournamentImage);
          } catch (err) {
            // Continuar a la navegación aunque falle la imagen
          }
        }
        
        // Navegar al torneo creado
        navigate(`/torneo/${data.id}`);
      }
    };
    
    processCreatedTournament();
  }, [data]);


  const availableFormats = isDisciplineSelected ? formatOptions : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2a] to-[#0f0f0f] px-4 py-32 relative overflow-hidden">
      {/* Animated Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            {/* Logo container */}
                <div className="relative w-25 h-25 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform overflow-hidden">
                  <img 
                    src="/logoTuTorneo png.png" 
                    alt="Logo TuTorneo" 
                    className="w-25 h-25 object-contain"
                  />                 
                </div>
          </div>
          <h1 className="text-white text-5xl mb-2 drop-shadow-lg">Crear Torneo</h1>
          <p className="text-purple-300">Configura tu torneo con todos los detalles necesarios</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-surface-dark/80 via-[#1f1635]/80 to-[#2a1f3d]/80 border border-purple-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 rounded-2xl"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>

          <div className="relative z-10">
            {/* Loader mientras se cargan los datos del usuario */}
            {loadingUserData && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50 rounded-lg flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 text-purple-300 animate-spin" />
                <span className="text-purple-300">Cargando información del perfil...</span>
              </div>
            )}

            {/* Alerta de perfil incompleto - solo mostrar después de cargar */}
            {!loadingUserData && isProfileIncomplete && (
              <Alert className="mb-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/50 text-yellow-300 shadow-lg shadow-yellow-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Debes completar tu perfil antes de crear un torneo.{" "}
                  <Link to="/perfil" className="underline font-semibold hover:text-yellow-200">
                    Ir a mi perfil
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Disciplina */}
              <div className="p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white">1</span>
                  </div>
                  <h3 className="text-white text-xl">Selecciona la Disciplina</h3>
                </div>
                <RHFSelect
                  name="discipline"
                  control={control}
                  label="Disciplina"
                  placeholder="Elige un juego"
                  options={disciplineOptions}
                  error={errors.discipline?.message}
                  disabled={isProfileIncomplete}
                />
              </div>

              {/* Step 2: Formato */}
              <div
                className={`p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20 transition-all duration-500 ${isDisciplineSelected ? "opacity-100 animate-fade-in" : "opacity-50"
                  }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${isDisciplineSelected
                    ? "bg-gradient-to-br from-purple-600 to-pink-600"
                    : "bg-gray-600"
                    }`}>
                    <span className="text-white">2</span>
                  </div>
                  <h3 className={`text-xl transition-colors ${isDisciplineSelected ? "text-white" : "text-gray-500"
                    }`}>
                    Selecciona el Formato
                  </h3>
                </div>
                <RHFSelect
                  name="format"
                  control={control}
                  label="Formato"
                  placeholder="Elige un formato"
                  options={availableFormats}
                  disabled={!isDisciplineSelected}
                  error={errors.format?.message}
                />
              </div>

              {/* Step 3: Detalles del Torneo */}
              <div
                className={`p-6 bg-gradient-to-br from-surface-dark-900/20 to-transparent rounded-xl border border-purple-500/20 transition-all duration-500 ${isFormatSelected ? "opacity-100 animate-fade-in" : "opacity-50"
                  }`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${isFormatSelected
                    ? "bg-gradient-to-br from-purple-600 to-pink-600"
                    : "bg-gray-600"
                    }`}>
                    <span className="text-white">3</span>
                  </div>
                  <h3 className={`text-xl transition-colors ${isFormatSelected ? "text-white" : "text-gray-500"
                    }`}>
                    Detalles del Torneo
                  </h3>
                </div>

                <div className="space-y-6">
                  {!isFormatSelected ? (
                    <div className="text-center text-gray-500">
                      <Info className="w-6 h-6 mx-auto mb-2" />
                      <p>Selecciona una disciplina y formato para configurar los detalles del torneo.</p>
                    </div>
                  ) : (
                    <>
                      {/* Nombre del Torneo */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <FileText className="w-5 h-5" />
                          <span>Información Básica</span>
                        </div>
                        <RHFInput
                          name="name"
                          control={control}
                          label="Nombre del Torneo"
                          placeholder="Ej: Copa TuTorneo 2024"
                          error={errors.name?.message}
                          disabled={!isFormatSelected}
                        />
                      </div>

                      {/* Fechas */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <Calendar className="w-5 h-5" />
                          <span>Fechas Importantes</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <RHFInput
                            name="registrationDeadline"
                            control={control}
                            label="Fecha Límite de Inscripción"
                            type="date"
                            error={errors.registrationDeadline?.message}
                            disabled={!isFormatSelected}
                          />
                          <RHFInput
                            name="startAt"
                            control={control}
                            label="Fecha de Inicio"
                            type="date"
                            error={errors.startAt?.message}
                            disabled={!isFormatSelected}
                          />
                          <RHFInput
                            name="endAt"
                            control={control}
                            label="Fecha de Fin"
                            type="date"
                            error={errors.endAt?.message}
                            disabled={!isFormatSelected}
                          />
                        </div>
                      </div>

                      {/* Participantes por Equipo */}
                      {isCollectiveDiscipline && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-purple-300 mb-2">
                            <Users className="w-5 h-5" />
                            <span>Configuración de Equipos</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RHFInput
                              name="minParticipantsPerTeam"
                              control={control}
                              label="Mínimo por Equipo"
                              type="number"
                              placeholder="1"
                              error={errors.minParticipantsPerTeam?.message}
                              disabled={!isFormatSelected}
                            />
                            <RHFInput
                              name="maxParticipantsPerTeam"
                              control={control}
                              label="Máximo por Equipo"
                              type="number"
                              placeholder="5"
                              error={errors.maxParticipantsPerTeam?.message}
                              disabled={!isFormatSelected}
                            />
                          </div>
                        </div>
                      )}

                      {/* Participantes del Torneo */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <Users className="w-5 h-5" />
                          <span>Capacidad del Torneo</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <RHFInput
                            name="minParticipantsPerTournament"
                            control={control}
                            label="Mínimo de Participantes"
                            type="number"
                            placeholder="2"
                            error={errors.minParticipantsPerTournament?.message}
                            disabled={!isFormatSelected}
                          />
                          <RHFInput
                            name="maxParticipantsPerTournament"
                            control={control}
                            label="Máximo de Participantes"
                            type="number"
                            placeholder="16"
                            error={errors.maxParticipantsPerTournament?.message}
                            disabled={!isFormatSelected}
                          />
                        </div>
                      </div>

                      {/* Costo y Premio */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <DollarSign className="w-5 h-5" />
                          <span>Economía del Torneo</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <RHFInput
                            name="registrationCost"
                            control={control}
                            label="Costo de Inscripción"
                            type="number"
                            placeholder="0.00"
                            error={errors.registrationCost?.message}
                            disabled={!isFormatSelected}
                          />
                        </div>
                        
                        <RHFRichTextEditor
                          name="prize"
                          control={control}
                          label="Premio (Opcional)"
                          placeholder="Ej: $1000 USD + Trofeo"
                          rows={2}
                          disabled={!isFormatSelected}
                        />
                        
                        <RHFRichTextEditor
                          name="detalles"
                          control={control}
                          label="Detalles (Opcional)"
                          placeholder="Agrega información adicional sobre el torneo..."
                          rows={3}
                          disabled={!isFormatSelected}
                        />
                      </div>

                      {/* Imagen del Torneo */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <ImageIcon className="w-5 h-5" />
                          <span>Imagen del Torneo (Opcional)</span>
                        </div>
                        <ImageUpload
                          onImageSelected={setTournamentImage}
                          onImageRemoved={() => setTournamentImage(null)}
                          disabled={!isFormatSelected}
                          label="Selecciona una imagen para el torneo"
                        />
                      </div>

                      {/* Liga: Ida y Vuelta */}
                      {isLigaFormat && (
                        <div className="space-y-4 p-4 bg-indigo-900/10 rounded-lg border border-indigo-500/20 animate-fade-in">
                          <RHFCheckbox
                            name="isDoubleRound"
                            control={control}
                            label="Torneo a dos ruedas (ida y vuelta)"
                            disabled={!isFormatSelected}
                          />
                        </div>
                      )}

                      {/* Torneo Privado */}
                      <div className="space-y-4 p-4 bg-purple-900/10 rounded-lg border border-purple-500/20">
                        <RHFCheckbox
                          name="isPrivate"
                          control={control}
                          label="Torneo Privado"
                          disabled={!isFormatSelected}
                        />

                        {isPrivate && (
                          <div className="mt-4 animate-fade-in">
                            <div className="relative">
                              <RHFInput
                                name="password"
                                control={control}
                                label="Contraseña del Torneo"
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingresa una contraseña"
                                error={errors.password?.message}
                                disabled={!isFormatSelected}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Términos y Condiciones */}
                      <div className="space-y-4 p-4 bg-blue-900/10 rounded-lg border border-blue-500/20">
                        <RHFCheckbox
                          name="acceptTerms"
                          control={control}
                          label={
                            <span className="text-purple-200">
                              Acepto los{" "}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-purple-400 hover:text-purple-300 underline"
                                  >
                                    términos y condiciones
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1a0d2e] border-purple-500/30 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl text-purple-300">Términos y Condiciones</DialogTitle>
                                    <DialogDescription className="text-purple-200">
                                      Por favor, lee cuidadosamente los siguientes términos
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 text-sm text-purple-100">
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">1. Aceptación de Términos</h3>
                                      <p>Al crear un torneo en TuTorneo, aceptas cumplir con estos términos y condiciones.</p>
                                    </section>
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">2. Responsabilidades del Organizador</h3>
                                      <p>Como organizador, eres responsable de:</p>
                                      <ul className="list-disc list-inside ml-4 space-y-1">
                                        <li>Proporcionar información precisa sobre el torneo</li>
                                        <li>Cumplir con las fechas establecidas</li>
                                        <li>Administrar equitativamente el torneo</li>
                                        <li>Resolver disputas de manera justa</li>
                                      </ul>
                                    </section>
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">3. Normas de Conducta</h3>
                                      <p>Los torneos deben mantener un ambiente respetuoso y profesional. No se permiten comportamientos tóxicos, discriminatorios o abusivos.</p>
                                    </section>
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">4. Gestión de Premios</h3>
                                      <p>El organizador es responsable de la distribución de premios según lo establecido en la descripción del torneo.</p>
                                    </section>
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">5. Cancelación y Modificaciones</h3>
                                      <p>Los organizadores pueden cancelar o modificar torneos con previo aviso a los participantes. En caso de cancelación, se debe reembolsar cualquier costo de inscripción.</p>
                                    </section>
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">6. Privacidad de Datos</h3>
                                      <p>TuTorneo se compromete a proteger la información personal de todos los usuarios según nuestra política de privacidad.</p>
                                    </section>
                                    <section>
                                      <h3 className="text-lg text-purple-300 mb-2">7. Suspensión de Cuenta</h3>
                                      <p>TuTorneo se reserva el derecho de suspender o eliminar torneos que violen estos términos o las leyes aplicables.</p>
                                    </section>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </span>
                          }
                          error={errors.acceptTerms?.message}
                          disabled={!isFormatSelected}
                        />
                        {!acceptTerms && isFormatSelected && (
                          <div className="flex items-start gap-2 text-blue-300 text-sm mt-2">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p>Debes aceptar los términos y condiciones para crear el torneo</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Submit
                  txt={loading ? "Creando torneo..." : "Crear Torneo"}
                  disabled={isProfileIncomplete}
                />
                {!isValid && isFormatSelected && (
                  <p className="text-yellow-400 text-sm text-center mt-3 flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    Por favor, completa todos los campos obligatorios correctamente
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl backdrop-blur-sm">
          <div className="flex items-start gap-3 text-blue-200">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="text-blue-100">Los campos se desbloquean progresivamente:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Selecciona primero la disciplina</li>
                <li>Luego elige el formato de juego</li>
                <li>Finalmente completa los detalles del torneo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
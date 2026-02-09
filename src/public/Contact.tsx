import { Mail, Phone, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { useApi } from "../hooks/useApi";
import { sendContactMessage } from "../services/api.service";
import type { ContactMessageRequest, ContactMessageResponse } from "../models";

export function Contact() {
  const [formValues, setFormValues] = useState<ContactMessageRequest>({
    name: "",
    email: "",
    message: "",
  });
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { fetch, data: response, error, loading } = useApi<ContactMessageResponse, ContactMessageRequest>(
    sendContactMessage
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    fetch(formValues);
  };

  useEffect(() => {
    if (!response) return;
    setFeedback({
      type: "success",
      text: response.message || "Mensaje enviado",
    });
    setFormValues({ name: "", email: "", message: "" });
  }, [response]);

  useEffect(() => {
    if (!error) return;
    const errorMsg =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "No se pudo enviar el mensaje";
    setFeedback({ type: "error", text: errorMsg });
  }, [error]);

  const handleChange = (field: keyof ContactMessageRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <div className="relative pt-20 pb-20">
      {/* Degradado superior - transparente arriba, sólido abajo */}
      <div className="absolute top-0 left-0 right-0 h-21 bg-gradient-to-b from-transparent to-surface-dark pointer-events-none z-[1]" />
      
      {/* Degradado inferior - sólido arriba, transparente abajo */}
      <div className="absolute bottom-0 left-0 right-0 h-21 bg-gradient-to-t from-transparent to-surface-dark pointer-events-none z-[1]" />
      
      <div className="container bg-surface-dark mx-auto min-w-full relative z-10 pt-20 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-white text-4xl mb-4 text-center">Contacto</h1>
          <p className="text-gray-400 text-center mb-12">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-white text-xl mb-6">Información de Contacto</h3>
                <p className="text-gray-400 mb-8">
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Email</div>
                    <div className="text-white">gestiontorneosuy@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Teléfono</div>
                    <div className="text-white">+598 097 346 185</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Ubicación</div>
                    <div className="text-white">Montevideo, Uruguay</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark/80 border border-white/20 rounded-2xl p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {feedback && (
                  <Alert
                    className={`border ${
                      feedback.type === "success"
                        ? "border-green-500/40 bg-green-900/20 text-green-200"
                        : "border-red-500/40 bg-red-900/20 text-red-200"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription className="text-current">
                      {feedback.text}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-gray-400" htmlFor="contact-name">Nombre</label>
                  <Input
                    id="contact-name"
                    placeholder="Tu nombre"
                    value={formValues.name}
                    onChange={handleChange("name")}
                    maxLength={120}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400" htmlFor="contact-email">Email</label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formValues.email}
                    onChange={handleChange("email")}
                    maxLength={254}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400" htmlFor="contact-message">Mensaje</label>
                  <Textarea
                    id="contact-message"
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    value={formValues.message}
                    onChange={handleChange("message")}
                    maxLength={4000}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-600 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado");
  };

  return (
    <div className="min-h-screen bg-surface-dark pt-20 pb-20 px-4">
      <div className="container mx-auto">
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
                    <div className="text-white">contacto@tutorneo.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Teléfono</div>
                    <div className="text-white">+598 123 456 789</div>
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

            <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-gray-400">Nombre</label>
                  <Input 
                    placeholder="Tu nombre"
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400">Email</label>
                  <Input 
                    type="email"
                    placeholder="tu@email.com"
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-400">Mensaje</label>
                  <Textarea 
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-600 resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                >
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

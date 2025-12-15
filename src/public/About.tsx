import { Award, Target, Users } from "lucide-react";

export function About() {
  return (
    <div className="relative min-h-screen pt-20 pb-20">
      {/* Background sólido en el centro */}
      <div className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Degradado superior - transparente arriba, sólido abajo */}
      <div className="absolute top-0 left-0 right-0 h-21 bg-gradient-to-b from-transparent to-surface-dark pointer-events-none z-[1]" />
      
      {/* Degradado inferior - sólido arriba, transparente abajo */}
      <div className="absolute bottom-0 left-0 right-0 h-21 bg-gradient-to-t from-transparent to-surface-dark pointer-events-none z-[1]" />
      
      <div className="container mx-auto bg-surface-dark min-w-full relative z-10 pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-4xl mb-8 text-center">¿Quiénes Somos?</h1>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white">Comunidad</h3>
              <p className="text-gray-400">
                Conectamos a miles de jugadores y organizadores apasionados por la competencia
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white">Misión</h3>
              <p className="text-gray-400">
                Facilitar la organización de torneos y hacer el deporte más accesible para todos
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white">Excelencia</h3>
              <p className="text-gray-400">
                Ofrecemos una plataforma confiable, segura y fácil de usar para todos
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-2xl p-8 mb-12">
            <p className="text-gray-300 leading-relaxed text-center mb-6">
              En <span className="text-purple-400">TuTorneo</span> creemos que todos merecen la oportunidad de competir y demostrar su talento. 
              Nuestra plataforma nace de la pasión por el deporte y la tecnología, con el objetivo de simplificar 
              la organización de torneos y crear experiencias memorables para jugadores de todos los niveles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white text-xl mb-4">Nuestra Historia</h3>
              <p className="text-gray-400">
                Fundada en 2025, TuTorneo surgió de la necesidad de simplificar la organización de torneos 
                deportivos y eSports.
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white text-xl mb-4">Nuestro Compromiso</h3>
              <p className="text-gray-400">
                Nos comprometemos a ofrecer una plataforma segura, transparente y accesible para todos. 
                Trabajamos constantemente para mejorar la experiencia de nuestros usuarios y añadir 
                nuevas funcionalidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


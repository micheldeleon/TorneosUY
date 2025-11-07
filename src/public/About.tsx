
export const About = () => {
    return (
        <section className="min-h-screen bg-surface text-slate-400 px-6 py-12 flex flex-col items-center justify-center">
            <div className="max-w-4xl text-center">
                <h1 className="text-4xl font-extrabold text-brand-title mb-6">¿Quiénes somos?</h1>
                <p className="text-lg leading-relaxed mb-4">
                    Somos una plataforma dedicada a la <strong>gestión de torneos deportivos</strong> y competencias en línea.
                    Nuestro objetivo es ofrecer una experiencia fácil, moderna y accesible tanto para organizadores como jugadores.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                    Nos apasiona el deporte, la tecnología y el trabajo en equipo. Creemos que la competencia sana impulsa el
                    crecimiento, y por eso creamos un espacio donde cada partido, torneo o desafío puede llevarse a cabo de forma
                    transparente, divertida y segura.
                </p>
                <p className="text-lg leading-relaxed">
                    Desde Uruguay para el mundo 🌍 — con la idea de que jugar y competir debería ser tan simple como hacer clic en “Participar”.
                </p>
            </div>
        </section>
    );
};

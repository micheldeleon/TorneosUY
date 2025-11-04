
export const Contact = () => {
    return (
        <section className="min-h-screen bg-surface text-slate-800 px-6 py-12 flex flex-col items-center justify-center">
            <div className="max-w-lg w-full bg-white shadow-md rounded-2xl p-8 border border-black/5">
                <h1 className="text-3xl font-extrabold text-brand-end mb-6 text-center">Contacto</h1>
                <form className="flex flex-col gap-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-2">
                            Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre"
                            className="w-full px-4 py-3 rounded-md bg-muted text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-brand-deep"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tuemail@mail.com"
                            className="w-full px-4 py-3 rounded-md bg-muted text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-brand-deep"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold mb-2">
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            placeholder="Escribí tu mensaje..."
                            rows={5}
                            className="w-full px-4 py-3 rounded-md bg-muted text-gray-800 placeholder-gray-600 outline-none resize-none focus:ring-2 focus:ring-brand-deep"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-end text-white font-semibold py-3 rounded-md hover:bg-brand-darker transition"
                    >
                        Enviar mensaje
                    </button>
                </form>
            </div>
        </section>
    );
};

// import React from "react";

// type Tournament = {
//   id: number;
//   title: string;
//   category: string;
//   status: "Público" | "Privado";
//   price: number; // 0 = Gratis
//   date: string;  // dd - mm - yyyy (texto para simplificar)
//   participants: number;
//   capacity: number;
// };

// const TOURNAMENTS: Readonly<Tournament[]> = [
//   {
//     id: 1,
//     title: "Campeonato Fútbol 5 x Campomar",
//     category: "Fútbol",
//     status: "Público",
//     price: 500,
//     date: "21 - 10 - 2025",
//     participants: 5,
//     capacity: 16,
//   },
//   {
//     id: 2,
//     title: "Carrera running",
//     category: "Running",
//     status: "Público",
//     price: 0,
//     date: "2 - 11 - 2025",
//     participants: 23,
//     capacity: 25,
//   },
//   {
//     id: 3,
//     title: "Torneo CS2 x XUruguay",
//     category: "eSports - CS2",
//     status: "Público",
//     price: 1000,
//     date: "29 - 11 - 2025",
//     participants: 5,
//     capacity: 8,
//   },
//   {
//     id: 4,
//     title: "Campeonato Fútbol 11 x Alcobendas",
//     category: "Fútbol",
//     status: "Privado",
//     price: 700,
//     date: "1 - 12 - 2025",
//     participants: 14,
//     capacity: 16,
//   },
// ];

// const HomeLanding: React.FC = () => {
//   const page = 2;

//   return (
//     <div className="min-h-screen w-full bg-[#e9ebff] text-slate-900">
//       {/* NAVBAR */}
//       <header className="sticky top-0 z-20">
//         <div className="w-full bg-gradient-to-r from-[#3c0f7a] to-[#1c1d6a] text-white">
//           <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
//                 🏆
//               </span>
//               <span className="font-semibold">Gestión de torneos</span>
//             </div>

//             <nav className="hidden md:flex items-center gap-8 text-sm">
//               <a href="#inicio" className="opacity-90 hover:opacity-100">
//                 Inicio
//               </a>
//               <a href="#quienes" className="opacity-90 hover:opacity-100">
//                 ¿Quiénes somos?
//               </a>
//               <a href="#faq" className="opacity-90 hover:opacity-100">
//                 Preguntas Frecuentes
//               </a>
//               <a href="#contacto" className="opacity-90 hover:opacity-100">
//                 Contacto
//               </a>
//             </nav>

//             <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur hover:bg-white/20">
//               Ingresar
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="mx-auto max-w-6xl px-4 pt-10 md:pt-14">
//         <h1 className="text-center text-3xl md:text-5xl font-extrabold text-[#1d1e6b] drop-shadow-md">
//           Organizá - Jugá - Ganá
//         </h1>
//       </section>

//       {/* TORNEOS */}
//       <section className="mx-auto max-w-6xl px-4 pt-10">
//         <div className="mb-6 flex items-center justify-between">
//           <h2 className="text-center mx-auto md:mx-0 text-lg font-semibold text-slate-700">
//             Torneos Disponibles
//           </h2>

//           <button
//             type="button"
//             className="hidden md:inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
//             aria-label="Filtrar torneos"
//           >
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//               <path d="M3 5h18v2H3zm3 6h12v2H6zm3 6h6v2H9z" />
//             </svg>
//             Filtrar
//           </button>
//         </div>

//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//           {TOURNAMENTS.map(t => (
//             <TournamentCard key={t.id} t={t} />
//           ))}
//         </div>

//         {/* Paginación */}
//         <div className="mt-8 flex items-center justify-center gap-6 text-slate-700">
//           <button type="button" className="hover:underline text-sm" aria-label="Página anterior">
//             &lt;
//           </button>
//           <span className="text-sm">{page}</span>
//           <button type="button" className="hover:underline text-sm" aria-label="Página siguiente">
//             &gt;
//           </button>
//         </div>
//       </section>

//       {/* SPONSORS */}
//       <section className="mx-auto max-w-6xl px-4 pt-10">
//         <h3 className="text-center text-slate-700 font-semibold mb-6">Patrocinadores</h3>
//         <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-center">
//           <Logo text="XBOX" />
//           <Logo text="Uruguay Natural" />
//           <Logo text="VIBEZ" />
//           <Logo text="logitech" />
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="mt-10">
//         <div className="bg-gradient-to-r from-[#3c0f7a] to-[#1c1d6a] text-white">
//           <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-[12px]">
//             <div className="flex items-center gap-4 opacity-90">
//               <span>ORT</span>
//               <span>•</span>
//               <span>CIE</span>
//             </div>
//             <div className="opacity-90">© 2025 Nuestra empresa</div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// type TournamentCardProps = { t: Tournament };

// const TournamentCard: React.FC<TournamentCardProps> = ({ t }) => {
//   const isFree = t.price === 0;
//   const progress = Math.min(100, Math.max(0, (t.participants / t.capacity) * 100));

//   return (
//     <article className="rounded-2xl bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.1)] border border-black/5">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-2 text-slate-600">
//           <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">
//             🏅
//           </span>
//           <span className="text-xs">{t.category}</span>
//         </div>
//         <span
//           className={`text-[10px] rounded-full px-2 py-0.5 font-semibold ${
//             t.status === "Público"
//               ? "bg-emerald-100 text-emerald-700"
//               : "bg-rose-100 text-rose-700"
//           }`}
//         >
//           {t.status}
//         </span>
//       </div>

//       <h4 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-800">{t.title}</h4>

//       <dl className="mt-4 space-y-2 text-xs text-slate-700">
//         <div className="flex items-center justify-between">
//           <dt className="opacity-70">Costo:</dt>
//           <dd className="font-semibold">{isFree ? "Gratis" : `$ ${t.price}`}</dd>
//         </div>
//         <div className="flex items-center justify-between">
//           <dt className="opacity-70">Fecha:</dt>
//           <dd className="font-semibold">{t.date}</dd>
//         </div>
//         <div className="flex items-center justify-between">
//           <dt className="opacity-70">Participantes:</dt>
//           <dd className="font-semibold">
//             {t.participants} / {t.capacity}
//           </dd>
//         </div>

//         {/* Barra de progreso */}
//         <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
//           <div className="h-full bg-[#1c1d6a]" style={{ width: `${progress}%` }} />
//         </div>
//       </dl>

//       <button
//         type="button"
//         className="mt-4 w-full rounded-full bg-[#27266e] py-2 text-xs font-semibold text-white hover:bg-[#1e1e5a]"
//       >
//         Inscribirme
//       </button>
//     </article>
//   );
// };

// type LogoProps = { text: string };

// const Logo: React.FC<LogoProps> = ({ text }) => (
//   <div className="flex h-14 items-center justify-center rounded-lg bg-white shadow-sm border border-black/5">
//     <span className="text-xl font-black tracking-wide text-slate-800">{text}</span>
//   </div>
// );

// export default HomeLanding;

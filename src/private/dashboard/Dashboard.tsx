import { ProfileCard } from "../../components/Profile";
import { Button, Card, DescriptionList, SectionHeader } from "../../components/ui";
import { InscriptionCard } from "../../components/InscriptionCard";

export default function Dashboard() {
  const user = {
    name: "Pedro Marquez",
    role: "Jugador",
    ci: "4.123.456-7",
    birth: "1996-06-12",
    phone: "+598 99 123 456",
    address: "Av. Siempre Viva 123",
    department: "Montevideo",
    disciplines: "Fútbol, eSports - CS2",
  };

  const items = [
    { label: "Nombre", value: user.name.split(" ")[0] },
    { label: "Apellido", value: user.name.split(" ").slice(1).join(" ") },
    { label: "CI", value: user.ci },
    { label: "Fecha Nacimiento", value: new Intl.DateTimeFormat("es-UY").format(new Date(user.birth)) },
    { label: "Nro celular", value: user.phone },
    { label: "Dirección", value: user.address },
    { label: "Departamento", value: user.department },
    { label: "Lista de disciplinas", value: user.disciplines },
  ];

  return (
    <div className="min-h-screen w-full bg-surface text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pt-10 space-y-8">
        {/* Top area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Avatar card */}
          <ProfileCard name={user.name} role={user.role} onEdit={() => alert("Editar perfil")} />

          {/* Datos personales */}
          <Card className="md:col-span-1">
            <SectionHeader title="Datos personales" />
            <div className="mt-4">
              <DescriptionList items={items} />
              <Button variant="primary" size="sm" className="mt-4">Modificar</Button>
            </div>
          </Card>

          {/* Organizar torneos */}
          <Card className="md:col-span-1 flex items-center justify-center">
            <Button className="rounded-full bg-gradient-to-r from-brand-start to-brand-end">
              Quiero organizar torneos.
            </Button>
          </Card>
        </div>

        {/* Mis inscripciones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Mis inscripciones.</span>
            <Button variant="ghost" size="sm" className="text-slate-700">
              <span className="mr-1">⎘</span> Filtrar
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InscriptionCard
              discipline="Fútbol"
              title="Campeonato Fútbol 11 x Alcobendas"
              status="Privado"
              price={700}
              date="2025-12-01"
              participants={14}
              capacity={16}
              onView={() => alert("Ver inscripción")}
            />
            <InscriptionCard
              discipline="eSports - CS2"
              title="Torneo CS2 x XUruguay"
              status="Público"
              price={1000}
              date="2025-11-29"
              participants={5}
              capacity={8}
              onView={() => alert("Ver inscripción")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


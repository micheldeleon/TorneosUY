import { useEffect } from "react";
import { ProfileCard } from "../../components/Profile";
import { Button, Card, DescriptionList, SectionHeader } from "../../components/ui";
import { getUsersByIdAndEmail } from "../../services/api.service";
import type { UserDetails } from "../../models/userDetails.model";
import { useApi } from "../../hooks/useApi";
import type { UserFind } from "../../models/userFind.model";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { fetch, data, error, loading } =
    useApi<UserDetails, UserFind>(getUsersByIdAndEmail);

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
    }
  }, [fetch]);

  return (
    <div className="min-h-screen w-full bg-surface text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pt-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <ProfileCard name={data?.name ?? "Usuario"} onEdit={() => alert("Editar perfil")} />

          <Card className="md:col-span-1">
            <SectionHeader title="Datos personales" />
            <div className="mt-4">
              <DescriptionList data={data} />
              {error && <div className="text-red-600 text-sm mt-2">{String(error)}</div>}
            </div>
          </Card>

          <Card className="md:col-span-1 flex items-center justify-center">
            <Button className="rounded-full bg-gradient-to-r from-brand-start to-brand-end">
              Quiero organizar torneos.
            </Button>
          </Card>
        </div>

        {/* resto de tu layout */}
      </div>
    </div>
  );
}


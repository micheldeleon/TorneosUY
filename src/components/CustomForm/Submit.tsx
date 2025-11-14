import { Button } from "../ui/Button";

interface SubmitProps {
  txt: string;
  loading?: boolean;
}

export function Submit({ txt, loading }: SubmitProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-600/50 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-[0.98]"
    >
      {loading ? "Cargando..." : txt}
    </Button>
  );
}

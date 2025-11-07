import { Button } from "../ui/Button";

interface Props {
  txt: string;
}

export const Submit = ({ txt }: Props) => {
  return (
    <Button type="submit" className="mt-4 text-brand-deep border border-white/60">
      {txt}
    </Button>
  );
};

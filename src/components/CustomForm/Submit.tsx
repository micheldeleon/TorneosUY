import { Button } from "../ui/Button";

interface Props {
  txt: string;
}

export const Submit = ({ txt }: Props) => {
  return (
    <Button type="submit" className="mt-4 bg-muted text-brand-deep hover:bg-muted-hover">
      {txt}
    </Button>
  );
};

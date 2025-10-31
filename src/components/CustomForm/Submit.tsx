import { Button } from "../ui/Button";

interface Props {
  txt: string;
}

export const Submit = ({ txt }: Props) => {
  return (
    <Button type="submit" className="mt-4 bg-[#d9d9f3] text-[#1e1e5a] hover:bg-[#c8c8ec]">
      {txt}
    </Button>
  );
};


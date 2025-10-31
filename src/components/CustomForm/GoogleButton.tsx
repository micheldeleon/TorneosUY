import { Button } from "../ui/Button";

interface Props {
  text: string;
}

export const GoogleButton = ({ text }: Props) => {
  return (
    <div className="flex justify-center mt-4">
      <Button variant="outline" size="sm">
        {text}
      </Button>
    </div>
  );
};

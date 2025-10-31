import { Link } from "react-router-dom";

export type LinkItem = { label: string; to: string };

interface Props {
  links: LinkItem[];
  onClick?: () => void;
  className?: string;
}

export const NavLinks = ({ links, onClick, className = "" }: Props) => (
  <nav className={className}>
    {links.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        onClick={onClick}
        className="opacity-90 hover:opacity-100 transition-opacity"
      >
        {link.label}
      </Link>
    ))}
  </nav>
);

export default NavLinks;


import { Link } from "react-router-dom";
import type { NavItem } from "./Navbar";

interface Props {
  links: NavItem[];
  onClick?: () => void;
}

export const NavLinks = ({ links, onClick }: Props) => (
  <>
    {links.map((link) => (
      <Link
        key={link.path}
        to={link.path}
        onClick={onClick}
        className="opacity-90 hover:opacity-100 transition-opacity"
      >
        {link.label}
      </Link>
    ))}
  </>
);

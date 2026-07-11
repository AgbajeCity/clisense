import { ReactNode } from "react";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children: ReactNode;
  showNavBar?: boolean;
}

export const Layout = ({ children, showNavBar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
      {showNavBar && <NavBar />}
    </div>
  );
};
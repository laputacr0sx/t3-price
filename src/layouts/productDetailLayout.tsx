import { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-full w-screen">
      <Navbar />
      <div className="flex h-screen flex-col bg-slate-950 text-slate-50">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

import { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="w-screen flex-none">
        <Navbar />
      </div>
      <div className="flex h-fit min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-50">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}

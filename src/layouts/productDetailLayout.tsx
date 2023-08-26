import { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-gradient-to-tl from-violet-400 via-amber-400 to-green-400 px-4 pb-16 pt-8">
      <Navbar />
      <div className="flex flex-grow">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

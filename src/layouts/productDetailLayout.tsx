import { type ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      {/* <div className="flex flex-grow"> */}
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-gradient-to-tl from-violet-400 via-amber-100 to-green-400">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

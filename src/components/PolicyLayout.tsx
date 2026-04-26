import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

interface PolicyLayoutProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, updated, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 bg-black border-b border-[#1e1e1e]">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" aria-label="Home">
            <BrandLogo size="sm" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#C8F135] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="font-display text-4xl tracking-wide text-white">
          {title}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#C8F135]">
          Don't Get Pickled — Last updated: {updated}
        </p>

        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-neutral-300 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-wide [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-[#C8F135] [&_a]:underline hover:[&_a]:brightness-110">
          {children}
        </div>

        <div className="mt-12 pt-6 border-t border-[#1e1e1e] flex flex-wrap gap-4 text-xs text-neutral-500">
          <Link to="/privacy" className="hover:text-[#C8F135] transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-[#C8F135] transition">
            Terms of Use
          </Link>
          <Link to="/" className="hover:text-[#C8F135] transition">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}

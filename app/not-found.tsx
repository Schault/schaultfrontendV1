import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6 font-inter text-center">
      <div className="max-w-md">
        <span className="rounded-full bg-black/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black/50">
          404 Error
        </span>
        <h1 className="mt-6 text-5xl font-extrabold tracking-wide text-black uppercase leading-tight">
          PAGE NOT FOUND
        </h1>
        <p className="mt-4 text-sm text-black/60 leading-relaxed">
          The page you are looking for does not exist or has been moved. Use the navigation menu or return to our homepage.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="rounded-xl bg-[#0350F0] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-[#0350F0]/20 transition-all hover:bg-[#0350F0]/90 active:scale-95"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </main>
  );
}

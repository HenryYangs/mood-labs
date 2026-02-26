import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="movie-theme relative mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Oops! Page Not Found!
        </h1>
        <p className="text-base text-white/80">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="pt-2">
          <Button
            asChild
            className="h-12 rounded-xl bg-linear-to-r from-[#b13a47] to-[#c9464f] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#ff0030] hover:to-[#ff1a3d] hover:text-white"
          >
            <Link href="/movie">Back to Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

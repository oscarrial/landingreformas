import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-balance font-display text-4xl tracking-[-0.02em] text-ink">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        La página que buscas no está disponible o ha cambiado de dirección.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-sm bg-ink px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-ink-soft"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

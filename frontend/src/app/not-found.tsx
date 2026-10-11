import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-moto-bg flex flex-col items-center justify-center px-4 text-center" role="status">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-5xl sm:text-7xl font-bold text-moto-copper">404</span>
        <h1 className="font-barlow text-3xl sm:text-4xl font-bold uppercase tracking-wider text-moto-text">
          Page Not Found
        </h1>
        <p className="text-moto-muted text-sm font-sans">
          The requested route or model atelier does not exist or has been relocated within the Meridian network.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-moto-copper text-moto-bg font-barlow font-bold text-sm tracking-wider uppercase px-8 py-4 rounded hover:bg-moto-copper/90 transition-all shadow-lg shadow-moto-copper/20"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

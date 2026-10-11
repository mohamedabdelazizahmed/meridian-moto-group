"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error logged for monitoring
  }, [error]);

  return (
    <div className="min-h-screen bg-moto-bg flex flex-col items-center justify-center px-4 text-center" role="alert">
      <div className="max-w-md space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-moto-apex/10 text-moto-apex border border-moto-apex/30">
          <span className="font-mono text-xl font-bold">!</span>
        </div>
        <h1 className="font-barlow text-3xl sm:text-4xl font-bold uppercase tracking-wider text-moto-text">
          System Exception Occurred
        </h1>
        <p className="text-moto-muted text-sm font-sans">
          An unexpected error occurred while loading this view. Our engineering team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-moto-copper text-moto-bg font-barlow font-bold text-sm tracking-wider uppercase px-6 py-3 rounded hover:bg-moto-copper/90 transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto bg-moto-surface border border-moto-border text-moto-text font-barlow font-bold text-sm tracking-wider uppercase px-6 py-3 rounded hover:border-moto-copper transition-all text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

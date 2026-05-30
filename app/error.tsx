'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-amber-900 mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Something went wrong!</h1>
        <p className="text-amber-700 mb-8">
          We encountered an unexpected error. Please try again or go back to the home page.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={reset}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-amber-200 text-amber-900 hover:bg-amber-50"
          >
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

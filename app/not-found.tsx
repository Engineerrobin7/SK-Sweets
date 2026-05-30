import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-amber-900 mb-4">404</div>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Page Not Found</h1>
        <p className="text-amber-700 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          asChild
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

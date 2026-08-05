import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 bg-skytape">
      <div className="poster-border hard-shadow rounded-2xl bg-paper p-12 max-w-md -rotate-1">
        <MapPinOff className="mx-auto text-coral mb-4" size={40} />
        <h1 className="font-display text-6xl text-ink mb-2">404</h1>
        <p className="font-display text-lg text-ink mb-2">NOT ON THE BOARD</p>
        <p className="text-pencil mb-8">
          This page doesn't exist or got taken down.
        </p>
        <Link
          to="/"
          className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

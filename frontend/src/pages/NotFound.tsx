import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-bold text-stone-800 mb-4">404</h1>
      <p className="text-stone-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-emerald-700 font-semibold hover:underline">
        Back to home
      </Link>
    </section>
  );
}

export default NotFound;
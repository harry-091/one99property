import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="grid min-h-screen place-items-center bg-sand p-6">
    <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
      <h1 className="text-4xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-slate-500">The page you requested is not part of the current One99 Properties flow.</p>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white">
        Go to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;


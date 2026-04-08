import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-surface-card text-text-main min-h-screen flex flex-col p-4 border-r border-surface-highest/20 shadow-sm relative z-10">
      <div className="mb-10 p-2">
        <h1 className="text-xl font-display font-medium text-brand-primary tracking-tight">
          AI Ticket Manager
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          to="/"
          className={`flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-sm ${
            isActive("/")
              ? "bg-brand-primary text-text-inverse shadow-md shadow-brand-primary/20"
              : "text-text-muted hover:bg-surface-low hover:text-text-main"
          }`}
        >
          <span>All Tickets</span>
        </Link>
        <Link
          to="/create"
          className={`flex items-center p-3 rounded-xl transition-all duration-200 font-medium text-sm ${
            isActive("/create")
              ? "bg-brand-primary text-text-inverse shadow-md shadow-brand-primary/20"
              : "text-text-muted hover:bg-surface-low hover:text-text-main"
          }`}
        >
          <span>Create Ticket</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

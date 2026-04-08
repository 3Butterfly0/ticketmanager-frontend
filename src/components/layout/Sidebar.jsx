import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-surface-card text-text-main h-screen flex flex-col p-4 border-r border-surface-highest/20 shadow-sm relative z-50">
      <div className="mb-10 p-2 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium text-brand-primary tracking-tight">
          AI Ticket Manager
        </h1>
        <button 
          onClick={onClose}
          className="lg:hidden p-1 text-text-muted hover:text-text-main"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          to="/"
          onClick={onClose}
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
          onClick={onClose}
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

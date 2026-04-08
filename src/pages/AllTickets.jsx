import React, { useState, useEffect } from 'react';
import { ticketApi } from '../api/ticketApi';
import TicketCard from '../components/ticket/TicketCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Link } from 'react-router-dom';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketApi.getAllTickets(filters);
      setTickets(data);
    } catch (err) {
      setError("Failed to fetch tickets. Check if server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', category: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-display font-medium text-text-main mb-2 tracking-tight">Ticket Dashboard</h1>
          <p className="text-text-muted font-body text-sm">Manage and track your support requests</p>
        </div>
        <Link 
          to="/create"
          className="px-6 py-3 bg-brand-primary text-text-inverse rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Ticket
        </Link>
      </div>

      <div className="bg-surface-low p-6 rounded-2xl flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 ml-1 font-body">Status</label>
          <select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full bg-surface-card rounded-lg p-3 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 ml-1 font-body">Priority</label>
          <select 
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="w-full bg-surface-card rounded-lg p-3 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1 ml-1 font-body">Category</label>
          <select 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full bg-surface-card rounded-lg p-3 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="BILLING">Billing</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BUG">Bug</option>
            <option value="FEATURE">Feature</option>
            <option value="ACCOUNT">Account</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <button 
          onClick={clearFilters}
          className="mt-6 px-4 py-2.5 text-xs font-bold text-text-muted hover:text-brand-primary transition-colors uppercase tracking-widest"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <Loader message="Fetching tickets..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchTickets} />
      ) : tickets.length === 0 ? (
        <EmptyState message="No tickets matching your filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTickets;

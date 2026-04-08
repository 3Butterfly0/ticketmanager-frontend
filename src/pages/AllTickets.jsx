import React, { useState, useEffect } from 'react';
import { ticketApi } from '../api/ticketApi';
import TicketCard from '../components/ticket/TicketCard';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';
import { Link } from 'react-router-dom';
import Pagination from '../components/ui/Pagination';
import TicketCardSkeleton from '../components/ticket/TicketCardSkeleton';

const ITEMS_PER_PAGE = 6;

const PRIORITY_WEIGHT = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });
  const [sortBy, setSortBy] = useState('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', category: '' });
    setSortBy('NEWEST');
  };

  // Sort tickets
  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === 'OLDEST') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'PRIORITY') {
      const pDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt) - new Date(a.createdAt); // fallback to newest
    } else {
      // NEWEST
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Pagination
  const totalItems = sortedTickets.length;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = sortedTickets.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-text-main mb-1 tracking-tight">Ticket Dashboard</h1>
          <p className="text-text-muted font-body text-xs">Manage and track your support requests</p>
        </div>
        <Link 
          to="/create"
          className="px-5 py-2.5 bg-brand-primary text-text-inverse rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Ticket
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 bg-surface-low/50 p-2 rounded-xl backdrop-blur-sm border border-surface-highest/20">
        <div className="flex flex-wrap items-center gap-2">
          <select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-surface-card rounded-lg px-3 py-2 text-xs font-bold font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm border border-surface-highest/30 cursor-pointer"
          >
            <option value="">Status: All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
          
          <select 
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="bg-surface-card rounded-lg px-3 py-2 text-xs font-bold font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm border border-surface-highest/30 cursor-pointer"
          >
            <option value="">Priority: All</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-surface-card rounded-lg px-3 py-2 text-xs font-bold font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm border border-surface-highest/30 cursor-pointer"
          >
            <option value="">Category: All</option>
            <option value="BILLING">Billing</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BUG">Bug</option>
            <option value="FEATURE">Feature</option>
            <option value="ACCOUNT">Account</option>
            <option value="OTHER">Other</option>
          </select>

          {(filters.status || filters.priority || filters.category || sortBy !== 'NEWEST') && (
            <button 
              onClick={clearFilters}
              className="px-3 py-2 text-[10px] font-bold text-text-muted hover:text-brand-primary transition-colors uppercase tracking-widest bg-surface-highest/20 hover:bg-brand-primary/10 rounded-lg ml-2"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-body">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-card rounded-lg px-3 py-2 text-xs font-bold font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all shadow-sm border border-surface-highest/30 cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="PRIORITY">Priority (High to Low)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(ITEMS_PER_PAGE).fill(0).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchTickets} />
      ) : sortedTickets.length === 0 ? (
        <EmptyState message="No tickets matching your filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalItems={totalItems} 
            itemsPerPage={ITEMS_PER_PAGE} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}
    </div>
  );
};

export default AllTickets;

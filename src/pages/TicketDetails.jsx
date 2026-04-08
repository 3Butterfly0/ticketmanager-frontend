import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import StatusBadge from '../components/ticket/StatusBadge';
import PriorityBadge from '../components/ticket/PriorityBadge';
import AISummaryCard from '../components/ai/AISummaryCard';
import Loader from '../components/ui/Loader';
import ErrorAlert from '../components/ui/ErrorAlert';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    summary: '',
  });

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketApi.getTicketById(id);
      setTicket(data);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        summary: data.summary || '',
      });
    } catch (err) {
      setError("Failed to fetch ticket details. Check if it exists.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSaveLoading(true);
    try {
      const updated = await ticketApi.updateStatus(id, newStatus);
      setTicket(updated);
      setFormData(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const updated = await ticketApi.updateTicket(id, formData);
      setTicket(updated);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div className="p-20"><Loader /></div>;
  if (error) return <div className="p-20"><ErrorAlert message={error} onRetry={fetchTicket} /></div>;
  if (!ticket) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-start">
        <div className="space-y-4 max-w-2xl">
          <Link to="/" className="inline-flex items-center text-[10px] font-bold text-text-muted hover:text-brand-primary transition-colors uppercase tracking-widest gap-2 font-body">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-display font-medium text-text-main leading-tight tracking-tight">
              {isEditing ? 'Editing Ticket' : ticket.title}
            </h1>
            {!isEditing && <StatusBadge status={ticket.status} />}
          </div>
        </div>

        {!isEditing && (
          <div className="flex justify-end gap-3 flex-wrap">
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-surface-highest text-text-main rounded-lg font-medium hover:bg-surface-highest/80 transition font-body"
            >
              Edit Ticket
            </button>
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1 bg-surface-base text-[10px] font-bold text-text-muted uppercase font-body z-10">Change Status</label>
              <select 
                value={ticket.status}
                onChange={handleStatusChange}
                disabled={saveLoading}
                className="bg-surface-card rounded-lg p-3 pt-3 text-sm font-body font-bold text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition disabled:opacity-50 min-w-[140px] appearance-none shadow-sm h-full"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AISummaryCard summary={ticket.summary} />
          
          <div className="bg-surface-card p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="border-b border-surface-highest/50 pb-6">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 font-body">Detailed Description</h3>
              {isEditing ? (
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                ></textarea>
              ) : (
                <p className="text-text-main/80 font-body leading-relaxed whitespace-pre-wrap text-sm">
                  {ticket.description}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3.5 bg-surface-highest text-text-main rounded-lg font-medium hover:bg-surface-highest/80 transition font-body"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex-1 py-3.5 bg-brand-primary text-text-inverse rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70 font-body"
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface-card p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-6 font-body">Metadata</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-2 font-body">Priority</label>
                {isEditing ? (
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-surface-low rounded-lg p-3 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                ) : (
                  <PriorityBadge priority={ticket.priority} />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-2 font-body">Category</label>
                {isEditing ? (
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-surface-low rounded-lg p-3 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  >
                    <option value="BILLING">Billing</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="BUG">Bug</option>
                    <option value="FEATURE">Feature</option>
                    <option value="ACCOUNT">Account</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-surface-low text-text-muted uppercase tracking-wider">
                    {ticket.category.replace('_', ' ')}
                  </span>
                )}
              </div>

              <div className="pt-6 border-t border-surface-highest/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-text-muted uppercase font-body">Created</span>
                  <span className="text-[11px] font-bold text-text-main font-body">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-text-muted uppercase font-body">Last Update</span>
                  <span className="text-[11px] font-bold text-text-main font-body">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;

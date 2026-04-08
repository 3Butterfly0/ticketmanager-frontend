import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import StatusBadge from '../components/ticket/StatusBadge';
import PriorityBadge from '../components/ticket/PriorityBadge';
import { aiApi } from '../api/aiApi';
import Loader from '../components/ui/Loader';
import ErrorAlert from '../components/ui/ErrorAlert';
import { toast } from 'react-hot-toast';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
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
  const [polishLoading, setPolishLoading] = useState(false);

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
      toast.success('Status updated');
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePolish = async () => {
    setPolishLoading(true);
    const capitalize = (text) => {
      if (!text) return '';
      const trimmed = text.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    };

    try {
      // allow AI to polish description
      const suggestion = await aiApi.getAISuggestion(formData.title, formData.description);
      setFormData(prev => ({
        ...prev,
        title: capitalize(prev.title),
        description: suggestion.summary || capitalize(prev.description),
      }));
      toast.success('Polished!');
    } catch (err) {
      // fallback polish
      setFormData(prev => ({
        ...prev,
        title: capitalize(prev.title),
        description: capitalize(prev.description)
      }));
      toast.error('AI polish failed, basic text cleanup applied.');
    } finally {
      setPolishLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketApi.deleteTicket(id);
        toast.success('Ticket deleted');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete ticket');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = {};
    const titleLen = formData.title.trim().length;
    const descLen = formData.description.trim().length;

    if (titleLen < 5) errors.title = "Title must be at least 5 characters.";
    if (titleLen > 100) errors.title = "Title cannot exceed 100 characters.";
    if (descLen < 10) errors.description = "Description must be at least 10 characters.";
    if (descLen > 1000) errors.description = "Description cannot exceed 1000 characters.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    setSaveLoading(true);
    try {
      const updated = await ticketApi.updateTicket(id, formData);
      setTicket(updated);
      setIsEditing(false);
      toast.success('Ticket updated');
    } catch (err) {
      toast.error("Failed to save changes.");
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
            {isEditing ? (
              <div className="w-full">
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  className={`text-4xl font-display font-medium text-text-main leading-tight tracking-tight rounded-lg px-2 outline-none w-full transition-all ${validationErrors.title ? 'bg-brand-danger/5 border border-brand-danger/30 focus:border-brand-danger/60' : 'bg-surface-low border border-transparent focus:border-brand-primary/30'}`}
                />
                {validationErrors.title && <p className="text-[11px] text-brand-danger mt-1.5 font-bold font-body px-2">{validationErrors.title}</p>}
              </div>
            ) : (
              <h1 className="text-4xl font-display font-medium text-text-main leading-tight tracking-tight">
                {ticket.title}
              </h1>
            )}
            {!isEditing && <StatusBadge status={ticket.status} />}
          </div>
        </div>

        {!isEditing && (
          <div className="flex justify-end gap-3 flex-wrap">
            <button 
              onClick={handleDelete}
              className="px-6 py-3 bg-brand-danger/10 text-brand-danger rounded-lg font-bold text-sm hover:bg-brand-danger hover:text-white transition-colors font-body"
            >
              Delete
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-surface-highest text-text-main rounded-lg font-bold text-sm hover:bg-surface-highest/80 transition font-body"
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
          
          <div className="bg-surface-card p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="border-b border-surface-highest/50 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-body">Detailed Description</h3>
                {isEditing && (
                  <button 
                    onClick={handlePolish}
                    disabled={polishLoading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-tertiary/10 text-brand-tertiary text-xs font-bold rounded-lg hover:bg-brand-tertiary hover:text-text-inverse transition-colors disabled:opacity-50"
                  >
                    ✨ {polishLoading ? 'Polishing...' : 'Polish'}
                  </button>
                )}
              </div>
              {isEditing ? (
                <div>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full rounded-lg p-4 text-sm font-body text-text-main outline-none transition-all resize-none ${validationErrors.description ? 'bg-brand-danger/5 border border-brand-danger/30 focus:ring-2 focus:ring-brand-danger/20' : 'bg-surface-low border border-transparent focus:ring-2 focus:ring-brand-primary/20'}`}
                  ></textarea>
                  {validationErrors.description && <p className="text-[11px] text-brand-danger mt-2 font-bold font-body">{validationErrors.description}</p>}
                </div>
              ) : (
                <p className="text-text-main/80 font-body leading-relaxed whitespace-pre-wrap text-sm">
                  {ticket.description}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="pt-6 mt-4 flex justify-between sm:justify-end items-center gap-4 border-t border-surface-highest/30">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setValidationErrors({});
                    setFormData({
                      title: ticket.title,
                      description: ticket.description,
                      category: ticket.category,
                      priority: ticket.priority,
                      status: ticket.status,
                      summary: ticket.summary || ''
                    });
                  }}
                  className="px-6 py-2.5 bg-surface-base text-sm font-bold text-text-main hover:bg-surface-low rounded-lg transition-colors font-body"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="px-8 py-3 bg-brand-primary text-text-inverse rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 font-body"
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

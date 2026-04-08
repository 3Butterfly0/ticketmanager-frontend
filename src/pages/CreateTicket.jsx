import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import AISuggestionBox from '../components/ai/AISuggestionBox';
import ErrorAlert from '../components/ui/ErrorAlert';
import { toast } from 'react-hot-toast';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    status: 'OPEN',
    summary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAISuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      title: (suggestion.title != null && suggestion.title !== '') ? suggestion.title : prev.title,
      description: (suggestion.description != null && suggestion.description !== '') ? suggestion.description : prev.description,
      category: suggestion.category || prev.category,
      priority: suggestion.priority || prev.priority,
      summary: suggestion.summary || prev.summary,
    }));
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);
    setError(null);
    try {
      await ticketApi.createTicket(formData);
      toast.success('Ticket created successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to create ticket. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-text-main mb-2 tracking-tight">Create New Ticket</h1>
        <p className="text-text-muted font-body text-xs md:text-sm">Provide details about your issue and our AI assistant will help you.</p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8 items-start">
        <div className="order-2 lg:order-1 lg:col-span-3 w-full">
          <form onSubmit={handleSubmit} className="bg-surface-card p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Issue Title</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Database connection timeout in production"
                className={`w-full rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-text-muted ${validationErrors.title ? 'bg-brand-danger/5 border border-brand-danger/30' : 'bg-surface-low border border-transparent'}`}
                required
              />
              {validationErrors.title && <p className="text-[11px] text-brand-danger mt-2 font-bold font-body">{validationErrors.title}</p>}
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed steps to reproduce the issue..."
                rows={6}
                className={`w-full rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-text-muted resize-none ${validationErrors.description ? 'bg-brand-danger/5 border border-brand-danger/30' : 'bg-surface-low border border-transparent'}`}
                required
              ></textarea>
              {validationErrors.description && <p className="text-[11px] text-brand-danger mt-2 font-bold font-body">{validationErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                >
                  <option value="BILLING">Billing</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="BUG">Bug</option>
                  <option value="FEATURE">Feature</option>
                  <option value="ACCOUNT">Account</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                </select>
              </div>
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="pt-6 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 border-t border-surface-highest/30">
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 text-sm font-bold text-text-muted hover:text-text-main transition-colors font-body sm:order-1 pt-2 sm:pt-0"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-primary text-text-inverse rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed font-body sm:order-2"
              >
                {loading ? 'Creating...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-2 w-full">
          <AISuggestionBox 
            title={formData.title} 
            description={formData.description} 
            onSuggestion={handleAISuggestion} 
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;

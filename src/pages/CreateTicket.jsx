import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import AISuggestionBox from '../components/ai/AISuggestionBox';
import Loader from '../components/ui/Loader';
import ErrorAlert from '../components/ui/ErrorAlert';
import { toast } from 'react-hot-toast';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      category: suggestion.category || prev.category,
      priority: suggestion.priority || prev.priority,
      summary: suggestion.summary || prev.summary,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim().length === 0 || formData.description.trim().length === 0) {
      setError("Title and description are required.");
      return;
    }

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-4xl font-display font-medium text-text-main mb-2 tracking-tight">Create New Ticket</h1>
        <p className="text-text-muted font-body text-sm">Provide details about your issue and our AI assistant will help you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-surface-card p-8 rounded-3xl space-y-6 shadow-sm">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Issue Title</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Database connection timeout in production"
                className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-text-muted"
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest font-body mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed steps to reproduce the issue..."
                rows={6}
                className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-text-muted resize-none"
                required
              ></textarea>
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

            <div className="pt-6 flex justify-end items-center gap-4 border-t border-surface-highest/30">
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 text-sm font-bold text-text-muted hover:text-text-main transition-colors font-body"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-primary text-text-inverse rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed font-body"
              >
                {loading ? 'Creating...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
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

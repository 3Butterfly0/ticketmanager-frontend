import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import AISuggestionBox from '../components/ai/AISuggestionBox';
import Loader from '../components/ui/Loader';
import ErrorAlert from '../components/ui/ErrorAlert';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
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
      navigate('/');
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
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
              <label className="block text-sm font-bold text-text-main font-body mb-2">Title</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-text-muted"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-text-main font-body mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide as much detail as possible..."
                rows={6}
                className="w-full bg-surface-low rounded-lg p-4 text-sm font-body text-text-main focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-text-muted resize-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-main font-body mb-2">Category</label>
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
                <label className="block text-sm font-bold text-text-main font-body mb-2">Priority</label>
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
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="pt-6 flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3.5 bg-surface-highest text-text-main rounded-lg font-medium hover:bg-surface-highest/80 transition font-body"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-brand-primary text-text-inverse rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed font-body"
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

import React, { useState } from "react";
import { aiApi } from "../../api/aiApi";

// trigger AI suggestion logic and handle response mapping
const AISuggestionBox = ({ title, description, onSuggestion }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  const handleSuggest = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Please provide both title and description first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await aiApi.getAISuggestion(title, description);
      setSuggestion(result);
    } catch (err) {
      setError("Failed to get suggestion. Keyword fallback might be offline.");
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      onSuggestion(suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="bg-brand-tertiary/10 backdrop-blur-xl border-2 border-brand-tertiary rounded-3xl p-8 my-6 relative group transform transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <label className="text-xs font-display font-bold text-brand-tertiary uppercase tracking-widest">
          AI Suggestion
        </label>
        <button
          onClick={handleSuggest}
          disabled={loading || !title || !description}
          className="text-xs font-bold px-4 py-2 rounded-lg bg-surface-card border border-brand-tertiary/30 text-brand-tertiary hover:bg-brand-tertiary hover:text-text-inverse disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {loading ? "Analyzing..." : "✨ Auto-fill"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-brand-danger mt-2 bg-brand-danger/10 p-3 rounded-lg border border-brand-danger/20 font-body">
          {error}
        </p>
      )}

      {suggestion && (
        <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-card rounded-xl border border-brand-tertiary/20 shadow-sm">
              <span className="block text-[10px] text-text-muted font-bold uppercase mb-1 font-body">
                Category
              </span>
              <span className="font-bold text-text-main font-body">
                {suggestion.category}
              </span>
            </div>
            <div className="p-4 bg-surface-card rounded-xl border border-brand-tertiary/20 shadow-sm">
              <span className="block text-[10px] text-text-muted font-bold uppercase mb-1 font-body">
                Priority
              </span>
              <span className="font-bold text-text-main font-body">
                {suggestion.priority}
              </span>
            </div>
          </div>
          <div className="p-4 bg-surface-card rounded-xl border border-brand-tertiary/20 shadow-sm">
            <span className="block text-[10px] text-text-muted font-bold uppercase mb-1 font-body">
              Generated Summary
            </span>
            <p className="text-sm font-body text-text-main/80 leading-relaxed">
              {suggestion.summary}
            </p>
          </div>
          <button
            onClick={applySuggestion}
            className="w-full py-3 bg-brand-tertiary text-text-inverse rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
          >
            Apply Suggestion
          </button>
        </div>
      )}

      {!suggestion && !loading && !error && (
        <p className="text-sm text-text-muted opacity-60 italic">
          Fill in the title and description to get intelligent suggestions for
          category and priority.
        </p>
      )}
    </div>
  );
};

export default AISuggestionBox;

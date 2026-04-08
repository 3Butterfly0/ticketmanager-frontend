import { fetchJSON } from './client';

const capitalize = (text) => {
  if (!text) return '';
  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const aiApi = {
  getAISuggestion: (title, description) => fetchJSON('/ai/suggest', {
    method: 'POST',
    body: JSON.stringify({ 
      title: capitalize(title), 
      description: capitalize(description) 
    }),
  }),
};

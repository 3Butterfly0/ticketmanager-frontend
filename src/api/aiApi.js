import { fetchJSON } from './client';

export const aiApi = {
  getAISuggestion: (title, description) => fetchJSON('/ai/suggest', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  }),
};

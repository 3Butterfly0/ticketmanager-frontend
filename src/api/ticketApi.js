import { fetchJSON } from './client';

export const ticketApi = {
  createTicket: (data) => fetchJSON('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAllTickets: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    
    const query = params.toString();
    return fetchJSON(`/tickets${query ? `?${query}` : ''}`);
  },

  getTicketById: (id) => fetchJSON(`/tickets/${id}`),

  updateTicket: (id, data) => fetchJSON(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  updateStatus: (id, status) => fetchJSON(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};

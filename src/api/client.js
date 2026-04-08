const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// fetch wrapper with JSON handling and error parsing
export async function fetchJSON(endpoint, options = {}) {
  const { headers, ...rest } = options;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
}

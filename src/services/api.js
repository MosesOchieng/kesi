const API_URL = 'http://localhost:3001/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const api = {
  // Evidence endpoints
  evidence: {
    create: async (data, token) => {
      const response = await fetch(`${API_URL}/evidence`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create evidence');
      return response.json();
    },

    getAll: async (token) => {
      const response = await fetch(`${API_URL}/evidence`, {
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch evidence');
      return response.json();
    },

    getById: async (id, token) => {
      const response = await fetch(`${API_URL}/evidence/${id}`, {
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch evidence');
      return response.json();
    },
  },

  // Case endpoints
  cases: {
    create: async (data, token) => {
      const response = await fetch(`${API_URL}/cases`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create case');
      return response.json();
    },

    getAll: async (token) => {
      const response = await fetch(`${API_URL}/cases`, {
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch cases');
      return response.json();
    },
  },
}; 
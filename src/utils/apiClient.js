import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// List of known browser extension paths to ignore
const IGNORED_PATHS = [
  '/writing',
  '/site_integration',
  '/generate',
  '/tone',
  '/get_template_list'
];

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Check if the error is from a browser extension
    const isBrowserExtensionError = IGNORED_PATHS.some(path => 
      error.config?.url?.includes(path) || 
      error.config?.pathPrefix?.includes(path)
    );

    if (isBrowserExtensionError) {
      console.debug('Ignoring browser extension error:', error.config?.url);
      return Promise.resolve({ data: null });
    }

    // Handle actual API errors
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific error cases
      if (status === 403) {
        console.warn('Authentication error:', data);
        // You might want to redirect to login here
        return Promise.reject({
          error: 'Authentication Error',
          message: 'Please log in to continue',
          status: 403
        });
      }

      return Promise.reject({
        error: data.error || 'API Error',
        message: data.message || 'An error occurred',
        status: status
      });
    }

    if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject({
        error: 'Network Error',
        message: 'Unable to connect to the server',
        status: 0
      });
    }

    console.error('Request setup error:', error.message);
    return Promise.reject({
      error: 'Request Error',
      message: error.message,
      status: 0
    });
  }
);

export const fetchDataset = async () => {
  try {
    const response = await apiClient.get('/api/dataset');
    return response.data;
  } catch (error) {
    console.error('Error fetching dataset:', error);
    throw error;
  }
};

export const fetchSheriaHubCases = async () => {
  try {
    const response = await apiClient.get('/api/sheriahub/cases');
    return response.data;
  } catch (error) {
    console.error('Error fetching SheriaHub cases:', error);
    throw error;
  }
};

export const updateSheriaHubCases = async (cases) => {
  try {
    const response = await apiClient.post('/api/sheriahub/cases', cases);
    return response.data;
  } catch (error) {
    console.error('Error updating SheriaHub cases:', error);
    throw error;
  }
};

export default apiClient; 
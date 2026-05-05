import axios from 'axios';
import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // increase timeout to 5 minutes to accommodate local LLM latency
  timeout: 300000,
});

// Add auth interceptor to include token in requests
apiClient.interceptors.request.use((config) => {
  const authHeaders = authService.getAuthHeaders();
  if (authHeaders.Authorization) {
    config.headers.Authorization = authHeaders.Authorization;
  }
  return config;
});

/**
 * Generate commit message from git diff.
 * @param {{ git_diff: string, style: 'conventional'|'short'|'detailed' }} payload
 */
export const generateCommit = async (payload) => {
  const body = {
    git_diff: typeof payload.git_diff === 'string' ? payload.git_diff : '',
    style: payload.style === 'short' || payload.style === 'detailed' ? payload.style : 'conventional',
  };
  const response = await apiClient.post('/api/generate-commit', body);
  return response.data;
};

export const apiService = {
  // Public endpoints
  async generateCommit(request) {
    const response = await axios.post(`${API_BASE_URL}/api/generate-commit`, request);
    return response.data;
  },

  // Protected endpoints
  async getCommits(repositoryName, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (repositoryName) params.append('repository_name', repositoryName);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await apiClient.get(`/api/commits?${params}`);
    return response.data;
  },

  async saveCommit(commitData) {
    const response = await apiClient.post('/api/commits', commitData);
    return response.data;
  },

  async getRepositoryInfo(request) {
    const response = await apiClient.post('/api/git/repository-info', request);
    return response.data;
  },

  async pushToGitHub(request) {
    const response = await apiClient.post('/api/git/push', request);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/api/profile');
    return response.data;
  }
};

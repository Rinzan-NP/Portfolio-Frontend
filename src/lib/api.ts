/**
 * API Configuration
 * Uses environment variables for API endpoint configuration
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}/api/v1${cleanEndpoint}`;
};

export { API_URL };

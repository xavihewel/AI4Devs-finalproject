import axios from 'axios';
import { env } from '../env';
import { getKeycloak } from '../auth/keycloak';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  const keycloak = getKeycloak();
  const token = keycloak?.token;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});


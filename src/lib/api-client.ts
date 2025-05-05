import Axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from "axios";

import { env } from "@/config/env";
import { paths } from "@/config/paths";

interface ErrorResponse {
  message?: string;
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<ErrorResponse>) => {
    const message = error.response?.data?.message || error.message;

    // Error notification logic removed - we'll use the built-in toast component directly where needed
    console.error("API Error:", typeof message === "string" ? message : "An error occurred");

    // Handle 401 unauthorized errors by redirecting to login page
    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirectTo") || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);

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

    console.error("API Error:", typeof message === "string" ? message : "An error occurred");

    if (error.response?.status === 401) {
      window.location.href = paths.landingPage.getHref();
    }

    return Promise.reject(error);
  },
);

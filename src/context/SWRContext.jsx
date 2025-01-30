import React from "react";
import { SWRConfig } from "swr";
import api from "../services/api"; // Centralized API service

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 5000, // ✅ Polling every 5 sec globally
        revalidateOnFocus: true, // ✅ Refresh when user refocuses the page
        revalidateOnReconnect: true, // ✅ Refresh when network reconnects
        dedupingInterval: 2000, // ✅ Avoid duplicate fetches within 2 sec
        shouldRetryOnError: true, // ✅ Retry on network errors
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;

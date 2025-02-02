import React from "react";
import { SWRConfig } from "swr";
import api from "../services/api";

const fetcher = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("SWR Fetch Error:", error.message);
    throw error;
  }
};

const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 1000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        shouldRetryOnError: true,
        errorRetryInterval: 5000,
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;
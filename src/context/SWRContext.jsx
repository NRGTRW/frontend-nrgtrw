import React from "react";
import { SWRConfig } from "swr";
import api from "../services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

const SWRProvider = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 5000,
        // revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        shouldRetryOnError: true,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;

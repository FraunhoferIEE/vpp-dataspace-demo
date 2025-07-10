import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { useEffect, useState } from "react";

export const useApi = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | undefined>(undefined as T);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async (source: CancelTokenSource) => {
      try {
        setLoading(true);
        const response: AxiosResponse<T> = await axios.get<T>(url, {
          ...options,
          cancelToken: source.token,
        });
        setData(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setError(error as Error);
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    const source = axios.CancelToken.source();
    fetchData(source);
    return () => {
      source.cancel();
    };
  }, [url, options]);

  return { data, loading, error };
};

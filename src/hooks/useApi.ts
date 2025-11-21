import { useCallback, useEffect, useState } from "react";
import type { UseApiCall } from "../models/useApi.model";

type Data<T> = T | null;
type CustomError = Error | null;

type ApiResult<T> = T & { _status: number };

type UseApiOptions<P> = {
  autoFetch?: boolean;
  params?: P;
};

interface UseApiResult<T, P> {
  loading: boolean;
  data: Data<ApiResult<T>>;
  error: CustomError;
  fetch: (param?: P) => () => void;
}

export const useApi = <T, P>(
  apiCall: (param?: P) => UseApiCall<T>,
  options?: UseApiOptions<P>
): UseApiResult<T, P> => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data<ApiResult<T>>>(null);
  const [error, setError] = useState<CustomError>(null);

  const fetch = useCallback(
    (param?: P) => {
      const { call, controller } =
        param !== undefined ? apiCall(param) : apiCall();

      setLoading(true);

      call
        .then((response) => {
          const payload = (response.data ?? {}) as T;
          setData(
            Array.isArray(payload)
              ? (payload as T & { _status: number })
              : ({ ...payload, _status: response.status } as T & { _status: number })
          );
          setError(null);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => controller.abort();
    },
    [apiCall]
  );

  useEffect(() => {
    if (options?.autoFetch) {
      return fetch(options?.params);
    }
  }, [fetch, options?.autoFetch, options?.params]);

  return { loading, data, error, fetch };
};

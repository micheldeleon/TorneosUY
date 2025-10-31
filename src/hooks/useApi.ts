import { useCallback, useEffect, useState } from "react";
import type { UseApiCall } from "../models/useApi.model";
type Data<T> = T | null;
type CustomError = Error | null;
type UseApiOptions<P> = {
    autoFetch?: boolean;
} & (P extends null ? { params?: P } : { params: P })

interface UseApiResult<T, P> {
    loading: boolean;
    data: Data<T>;
    error: CustomError;
    fetch: (param: P) => void;
}
export const useApi = <T, P,>(apiCall: (param?: P) => UseApiCall<T>, options?: UseApiOptions<P>): UseApiResult<T, P> => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Data<T>>(null)
    const [error, setError] = useState<CustomError>(null)
    const fetch = useCallback((param?: P) => {
        const { call, controller } = apiCall(param);
        setLoading(true);
        call.then((response) => {
            console.log('respuesta', response)
            setData(response.data);
            setError(null)
        }).catch((err) => {
            setError(err)
        }).finally(() => {
            setLoading(false)
        })
        return () => controller.abort()
    }, [apiCall])


    useEffect(() => {
        if (options && options.autoFetch) {
            return fetch(options.params);
        }
    }, [fetch, options])

    return { loading, data, error, fetch }
}
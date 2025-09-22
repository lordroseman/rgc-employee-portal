import type { PaginationRequestParam } from "~/types/common";

export const useCrudApi = <T>(url: string) => {
    const config = useRuntimeConfig();


    const getAll = async (params?: PaginationRequestParam) => { 
        return useAuthFetch<T[]>(config.public.hrisApiUrl + `${url}`, {
            query: params
        });
    } 

    const get = async  <T>(latest: boolean = false) => {
        const query = latest ? `?latest=true` : '';
        return useAuthFetch<T>(config.public.hrisApiUrl + `${url}${query}`, {
            method: 'GET'
        });
    }

    const create = async (resource: T) => {
        return useAuthFetch<T>(config.public.hrisApiUrl + `${url}`, {
            method: 'POST',
            body: JSON.stringify(resource)
        })
    }

    const update = async (id: number, resource: Partial<T>) =>    {
        return useAuthFetch<T>(config.public.hrisApiUrl + `${url}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(resource)
        })
    }

    const remove = async( id: number ) => {
         return useAuthFetch<T>(config.public.hrisApiUrl + `${url}/${id}`, {
            method: 'DELETE'
        })
    }
 

    return {
        getAll, 
        get,
        create,
        update,
        remove 
    }
}
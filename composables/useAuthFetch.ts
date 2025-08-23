import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { PaginationMeta } from '~/types/common'
import qs from 'qs'

export const useAuthFetch = async <
    DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    url: R,
    options?: O
  ) => {
   
   const auth = useAuthStore()
   const token = auth.token


   type Response = {
      data: T, 
      meta?: PaginationMeta
   }

    // Manually serialize query params if needed
  let finalUrl = url as string
  const hasParams = options?.query && typeof options.query === 'object'
  if (hasParams) {
    const queryString = qs.stringify(options!.query, { encode: true, indices: false })
    finalUrl += `?${queryString}`
    // Remove query from options so $fetch doesn't try to encode it again
    delete (options).query
  }

   

   return  $fetch<Response>(finalUrl, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options?.headers
    }
  })
}
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
  let token = auth.token

  type ErrorResponse = {
    success: false,
    errors?: Record<keyof T, string[]> 
  }  

  type SuccessResponse = {
    success: true,
    data: T,
    meta?: PaginationMeta,
  }


   type Response = ErrorResponse | SuccessResponse

  if(!token) {
    // Try to refresh token
    await auth.refreshAccessToken()

    if(!auth.token) {
      throw new Error('No access token available')
    }

    // Update token after refresh
    token = auth.token
  }






  // Copy options so we don't mutate the caller's object.
  let fetchOptions = { ...(options ?? {}) } as O
  let hasRetried = false

  // Manually serialize query params if needed
  let finalUrl = url as string
  const hasParams = fetchOptions?.query && typeof fetchOptions.query === 'object'
  if (hasParams) {
    const queryString = qs.stringify(fetchOptions.query, { encode: true, indices: false })
    finalUrl += `?${queryString}`
    // Remove query from options so $fetch doesn't try to encode it again
    const { query: _query, ...rest } = fetchOptions as unknown as { query?: unknown } & Record<string, unknown>
    fetchOptions = rest as unknown as O
  }

   

  const buildHeaders = (authToken: string | null | undefined) => {
    const optionHeaders = (fetchOptions?.headers ?? {}) as unknown as Record<string, string>
    return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'api-version': '1.0',
    ...optionHeaders,
    Authorization: authToken ? `Bearer ${authToken}` : undefined
    }
  }

  try {
    return await $fetch<Response>(finalUrl, {
      ...fetchOptions,
      headers: buildHeaders(token)
    })
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status === 401 && !hasRetried) {
      const refreshed = await auth.refreshAccessToken()
      if (!refreshed || !auth.token) {
        throw new Error('Unauthenticated')
      }

      token = auth.token

      hasRetried = true

      return await $fetch<Response>(finalUrl, {
        ...fetchOptions,
        headers: buildHeaders(token)
      })
    }

    throw error
  }
}
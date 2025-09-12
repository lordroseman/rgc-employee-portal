export const useLoading = () => {
  return useState<boolean>('global-loading', () => false)
}
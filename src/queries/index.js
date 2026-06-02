
import { QueryClient } from 'react-query'

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

const queryClient = createQueryClient()

export default queryClient

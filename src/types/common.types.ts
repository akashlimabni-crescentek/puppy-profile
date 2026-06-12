export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface AsyncState<T> {
  data: T | null
  status: LoadingStatus
  error: ApiError | null
}

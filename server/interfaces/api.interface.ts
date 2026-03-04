export interface ApiSuccess<T> {
  ok: true
  data: T
}

export interface ApiError {
  ok: false
  message: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

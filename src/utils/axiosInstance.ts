import axios from 'axios'
import { supabase } from '@utils/supabaseClient'

/**
 * Configured Axios instance.
 * Request interceptor: attaches the current Supabase session token automatically.
 * Response interceptor: handles 401 globally by signing the user out.
 *
 * Used for any non-Supabase HTTP calls. The Supabase JS client manages
 * its own requests internally.
 */
const axiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

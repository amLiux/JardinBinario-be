import axios, { AxiosError } from "axios"
import { Cache } from "./Cache"

export interface HCUserInfo {
  id: string
  name: string
  email: string
}

export interface HCLoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface HCVerifyResponse {
  authenticated: boolean
  auth_type: string
  user: HCUserInfo
  permissions: Record<string, string[]>
  expires_at: string | null
}

export interface HCRegisterInput {
  email: string
  password: string
  name: string
  last_name: string
  avatar?: string
}

export interface HCRegisterResponse {
  id: string
  email: string
  name: string
  last_name: string
  created_at: string
}

export class HortusError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError: boolean = false
  ) {
    super(message)
    this.name = "HortusError"
  }
}

const BASE_URL = process.env.HORTUS_CLAVIS_URL || "https://hortusclavis-production.up.railway.app"
const VERIFY_CACHE_TTL = 5 * 60 * 1000
const verifyCache = new Cache<HCVerifyResponse>(VERIFY_CACHE_TTL)

function buildClient() {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
  })
}

function handleError(err: unknown): never {
  if (err instanceof AxiosError) {
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "ETIMEDOUT" || !err.response) {
      throw new HortusError(`HC unreachable: ${err.message}`, undefined, true)
    }
    throw new HortusError(
      `HC error: ${err.response?.data?.detail || err.message}`,
      err.response?.status,
      false
    )
  }
  throw new HortusError(`Unexpected error: ${String(err)}`, undefined, true)
}

export class HortusProvider {
  static async login(email: string, password: string): Promise<HCLoginResponse> {
    try {
      const client = buildClient()
      const { data } = await client.post<HCLoginResponse>("/auth/login", { email, password })
      return data
    } catch (err) {
      return handleError(err)
    }
  }

  static async verify(token: string): Promise<HCVerifyResponse> {
    const cached = verifyCache.get(token)
    if (cached) return cached

    try {
      const client = buildClient()
      const { data } = await client.post<HCVerifyResponse>(
        "/auth/verify",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      verifyCache.set(token, data)
      return data
    } catch (err) {
      return handleError(err)
    }
  }

  static async register(input: HCRegisterInput): Promise<HCRegisterResponse> {
    try {
      const client = buildClient()
      const { data } = await client.post<HCRegisterResponse>("/auth/register", input)
      return data
    } catch (err) {
      return handleError(err)
    }
  }

  static async logout(token: string): Promise<void> {
    verifyCache.delete(token)

    try {
      const client = buildClient()
      await client.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } })
    } catch (err) {
      return handleError(err)
    }
  }

  static clearVerifyCache(): void {
    verifyCache.clear()
  }
}

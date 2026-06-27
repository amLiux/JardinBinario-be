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

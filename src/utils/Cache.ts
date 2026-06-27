interface CacheEntry<T> {
	data: T
	expiresAt: number
}

export class Cache<T> {
	private store = new Map<string, CacheEntry<T>>()
	private cleanupInterval: ReturnType<typeof setInterval>

	public constructor(private ttlMs: number = 5 * 60 * 1000) {
		this.cleanupInterval = setInterval(() => this.cleanup(), ttlMs)
	}

	public get(key: string): T | undefined {
		const entry = this.store.get(key)
		if (!entry) return undefined
		if (Date.now() > entry.expiresAt) {
			this.store.delete(key)
			return undefined
		}
		return entry.data
	}

	public set(key: string, data: T): void {
		this.store.set(key, { data, expiresAt: Date.now() + this.ttlMs })
	}

	public delete(key: string): void {
		this.store.delete(key)
	}

	public clear(): void {
		this.store.clear()
	}

	private cleanup(): void {
		const now = Date.now()
		for (const [key, entry] of this.store) {
			if (now > entry.expiresAt) this.store.delete(key)
		}
	}

	public destroy(): void {
		clearInterval(this.cleanupInterval)
		this.store.clear()
	}
}

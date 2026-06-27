export class HortusError extends Error {
	public constructor(
		message: string,
		public statusCode?: number,
		public isNetworkError: boolean = false
	) {
		super(message)
		this.name = "HortusError"
	}
}

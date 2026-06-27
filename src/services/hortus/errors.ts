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

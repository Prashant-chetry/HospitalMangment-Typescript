export default class HttpError extends Error {
  status: number;
  success: boolean;
  message: string;
  constructor(success?: boolean, status?: number, message?: string) {
    super(message);
    this.success = success || false;
    this.message = message || 'Internal Server Error';
    this.status = status || 500;
  }
}

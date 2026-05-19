export class QuidaxError extends Error {
  public statusCode: number;
  public status: string;
  public data: any;
  public isQuidaxError: boolean = true;

  constructor(statusCode: number, status: string, message: string, data?: any) {
    super(message);
    this.name = 'QuidaxError';
    this.statusCode = statusCode;
    this.status = status;
    this.data = data;
    
    // Set prototype explicitly for built-in Error extending in TS/JS
    Object.setPrototypeOf(this, QuidaxError.prototype);
  }
}

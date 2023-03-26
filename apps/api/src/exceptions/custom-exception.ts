export class CustomException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    // Preserve the prototype chain
    Object.setPrototypeOf(this, CustomException.prototype);
  }
}
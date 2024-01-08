import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode: number = 404;

  constructor() {
    super("Route not found");
  }
  serializeErrors() {
    //         1        404
    // [service number]-[error status]
    return [{ message: "Not found", code: 1404 }];
  }
}

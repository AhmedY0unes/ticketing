import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidaionError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request paramaters');


      //Only because we are extending a built in class
      Object.setPrototypeOf(this, RequestValidaionError.prototype);

  }
  serializeErrors() {
    return this.errors.map( err => {
      return { message: err.msg, field: err.param}
    })
  }
}

// throw new RequestValidaionError(errors);
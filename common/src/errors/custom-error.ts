//abstract class will be a lass when we transform to JS code, but an interface won't.
export abstract class CustomError extends Error {

  abstract statusCode: number;
  abstract serializeErrors(): {
    message: string; field?: string
  }[];

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}


//Every subclass must satisfy the fields in the abstracts class that it extends.
// class NotFound extends CustomError {
//   statusCode=0;
//   serializedErrors(){
//     return [{message: string; field: string}, {message: string}]
//   }
// }
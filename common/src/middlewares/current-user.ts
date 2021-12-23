import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface Userpayload {
  id: string;
  email: string;
}
// we use this to augument an existing type definition as we wish
declare global {
  // inside express project
  namespace Express {
    interface Request {
      currentUser?: Userpayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ? conditional if req.session || req.session.jwt
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as Userpayload; // extract info from json web token
    req.currentUser = payload;
  } catch (err) {}
  next();
};

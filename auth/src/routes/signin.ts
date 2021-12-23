import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@ay-ms-pain/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    ); // to solve the type error we will do a check in the index.ts file.
    //! means we tell typescript that we alread checked this elsewhere
    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };

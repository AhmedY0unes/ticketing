import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@ay-ms-pain/common';

const app = express();
app.set('trust proxy', true); //
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encryption cuz the JWT is already increpted
    secure: process.env.NODE_ENV !== 'test', //https connection limited
    //to make avoid the test faild issue when using test, since supertest uses only http connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*', () => {
  throw new NotFoundError();
});

//if async
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError());
// })
//but rather we use a package express-async-errors
app.use(errorHandler);
const options = {
  useNewUrlParser: true,
  useunifiedTopology: true,
  useCreateIndex: true,
};

export { app };

import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@ay-ms-pain/common';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true); //
app.use(json());
app.use(
  cookieSession({
    signed: false, //disable encryption cuz the JWT is already increpted
    secure: process.env.NODE_ENV !== 'test', //https connection limited
    //to avoid the test faild issue when using test, since supertest uses only http connection
  })
);
app.use(currentUser);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.all('*', () => {
  throw new NotFoundError();
});

//if async
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError());
// })
//but rather we use a package express-async-errors
app.use(errorHandler);

export { app };

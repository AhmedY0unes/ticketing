import mongoose from 'mongoose';
import { app } from './app';
const dbURL = 'mongodb://auth-mongo-srv:27017/auth';
const start = async () => {
  console.log('Starting Up.....');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defiend');
  } //
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defiend');
  } //
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongoDB..');
  } catch (err) {
    console.error(err);
  }
  app.get('/api/users/currentuser', (req, res) => {
    res.send('Hi There');
  });

  app.listen(3000, () => {
    console.log('Listening on 3000...');
  });
};

start();

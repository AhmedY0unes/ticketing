import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';
declare global {
  function signin(id?: string): string[];
  //may change
}
jest.mock('../nats-wrapper');
process.env.STRIPE_KEY =
  'sk_test_51K99H1AjPRb2YfVbmWXrn1PTAZokiOJox3umAQz0xeXFEXVB14Z9Is6Kr6EJdJEcMrPJNZBy2QYNHUAMjMwgXd3k00L9VCn4fG';

let mongo: any;
//hook function means this will run before all of
//our tests start excecuting.
beforeAll(async () => {
  process.env.JWT_KEY = 'BrB';

  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});
//reset all the data between each test runs.
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});

global.signin = (id?: string) => {
  // Build a JWT payload. {id, email}

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  //create a jWT.
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session Object. {jwt: MY_JWT}
  const session = { jwt: token };
  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return a string that is a cookie with the encoded data-
  return [`express:sess=${base64}`];
  //eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall4T1RZM056UXlNRFE1WVRKaE0yTXlOV1UwTkdNeVpTSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZek56STFNRGc0TW4wLjZXZWxlN2lIX1Z1SWNhaEdNbzMwbnZRTFJqR3VkcGZFNEpBSEwzcWV2dTQifQ==
};

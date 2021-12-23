import { scrypt, randomBytes } from 'crypto';
//scrypt is a hashing function.
import { promisify } from 'util';
//promisify is to customize a callback function to a
//promise based
//implementation to be compaitable with async await
const scryptAsync = promisify(scrypt);

//
export class Password {
  //static is to access the functions withhout the need to make
  //an instance of the class that contains them.
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storePassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storePassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}

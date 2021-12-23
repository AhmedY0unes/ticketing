// old way
import mongoose from 'mongoose';
import { Password } from '../services/password';
// An interface that describe the properties
// that are require to reate a new user
interface UserAttrs {
  email: string;
  password: string;
} //
// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret['password'];
        delete ret['__v'];
        delete ret['_id'];
        return ret;
      },
    },
  }
);
// userSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     ret.id = ret._id;
//     delete ret['password'];
//     delete ret['__v'];
//     delete ret['_id'];
//     return ret;
//   },
// });

//before save run this.
//using function instead of => so that we can use the 'this' notation.

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
//<> what is inside are generics that allows us to customize
//the types being used inside a function, a class or and inteface

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// }
// User.build({
//   email: 'te',
//   password: 's'
// })

export { User };

//adham way
// import mongoose from 'mongoose';
// import { Password } from '../services/password';

// interface User {
//   email: string;
//   password: string;
// }

// const userSchema = new mongoose.Schema<User>(
//   {
//     email: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     toJSON: {
//       transform(doc, ret) {
//         ret.id = ret.__id;
//         delete ret._id;
//         delete ret.password;
//         delete ret.__v;
//       },
//     },
//   }
// );

// userSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = await Password.toHash(this.get('password'));
//     this.set('password', hashed);
//   }
//   done();
// });

// const User = mongoose.model<User>('User', userSchema);
// // //<> what is inside are generics that allows us to customize
// // //the types being used inside a function, a class or and inteface
// export { User };

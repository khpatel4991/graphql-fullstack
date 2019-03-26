import { IResolvers } from 'graphql-tools';
import * as argon2 from 'argon2';
import { User } from './entity/User';

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      const user = await User.findOne(req.session.userId);
      return user;
    },
  },
  Mutation: {
    playerTag: async (_, { tag }, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      console.time(`Assign tag "${tag} to ${req.session.userId}"`);
      const user = await User.findOneOrFail(req.session.userId);
      console.timeEnd(`Assign tag "${tag} to ${req.session.userId}"`);
      return user;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }
      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
    register: async (_, { email, password }) => {
      const hashedPassword: string = await argon2.hash(password);
      await User.create({
        email,
        password: hashedPassword,
      }).save();
      return true;
    },
    stripeCharge: async (_, { token }, { req }) => {
      console.log(`Token: ${token}`);
      if (!req.session.userId) {
        return false;
      }
      console.time(`Assign tag "${token} to ${req.session.userId}"`);
      // const user = await User.findOneOrFail(req.session.userId);
      console.timeEnd(`Assign tag "${token} to ${req.session.userId}"`);
      return true;
    },
  },
};

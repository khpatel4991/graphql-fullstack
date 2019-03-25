import { IResolvers } from "graphql-tools";
import * as argon2 from "argon2";
import { User } from "./entity/User";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { req }) => {
      if(!req.session.userId) {
        return null;
      }
      const user = await User.findOne(req.session.userId);
      return user;
    }
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword: string = await argon2.hash(password);
      await User.create({
        email,
        password: hashedPassword
      }).save();
      return true;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email }});
      if (!user) {
        return null;
      }
      const validPassword = await argon2.verify(user.password, password);
      if(!validPassword) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    }
  }
}
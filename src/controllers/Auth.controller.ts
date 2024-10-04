import { v4 } from "uuid";
import { generateJWT } from "../helpers/authFunctions";
import { findUserByEmail } from "../helpers/findUserByEmail";
import { Errors, generateErrorObject } from "../helpers/Logger";
import { UserModel } from "../models/User";
import { CustomContext, Token, User } from "../types/sharedTypes";
import { notifyUserAboutForgotPassword } from "../helpers/SMTP";
import { getAllUsers } from "../helpers/getAllUsers";
import { toggleActive } from "../helpers/toggleActive";

interface AuthInput {
  authInput: {
    email: User["email"];
    password: User["password"];
  };
}

interface UserInput {
  userInput: {
    name: User["name"];
    email: User["email"];
    lastName: User["lastName"];
    password: User["password"];
    avatar: User["avatar"];
  };
}
interface ForgotPasswordInput {
  forgotPasswordInput: {
    email: User["email"];
    otp: User["tempPassword"];
    time: User["tempPasswordTime"];
    newPassword: User["password"];
  };
}

export const AuthResolvers = {
  Query: {
    getUserInfo: async (_: any, __: any, ctx: CustomContext): Promise<User> => {
      try {
        return ctx?.User;
      } catch (err) {
        const error = await generateErrorObject(
          Errors.SESSION_EXPIRED,
          String(err),
          ctx
        );
        throw error;
      }
    },
    getAllUsers: async (
      _: any,
      __: any,
      ctx: CustomContext
    ): Promise<User[] | undefined> => {
      try {
        const Users = await getAllUsers();
        console.log(Users);
        return Users;
      } catch (err) {
        const error = await generateErrorObject(
          Errors.SESSION_EXPIRED,
          String(err),
          ctx
        );
        throw error;
      }
    },
  },
  Mutation: {
    newUser: async (
      _: any,
      { userInput }: UserInput,
      ctx: CustomContext
    ): Promise<User> => {
      const { email } = userInput;

      if (!/@jardinbinario.com\s*$/.test(email)) {
        throw await generateErrorObject(
          Errors.NOT_VALID_DOMAIN,
          `${email} does not have a valid domain.`,
          ctx
        );
      }

      const User = await findUserByEmail(email);

      if (User) {
        throw await generateErrorObject(
          Errors.DUPLICATED_RECORD,
          `${email} it's already in use.`,
          ctx
        );
      }

      try {
        const newUser = await new UserModel(userInput).save();
        return newUser;
      } catch (err) {
        throw await generateErrorObject(
          Errors.INTERNAL_SERVER_ERROR,
          String(err),
          ctx
        );
      }
    },
    toggleUserActive: async (
      _: any,
      { email }: Record<string, string>,
      ctx: CustomContext
    ): Promise<User> => {

      if (!/@jardinbinario.com\s*$/.test(email)) {
        throw await generateErrorObject(
          Errors.NOT_VALID_DOMAIN,
          `${email} does not have a valid domain.`,
          ctx
        );
      }

      try {
        const deactivadedUser = await toggleActive(email);

        if (!deactivadedUser) {
          throw await generateErrorObject(
            Errors.NOT_FOUND,
            `${email} is not a valid user.`,
            ctx
          );
        }

        return deactivadedUser;
      } catch (err) {
        throw await generateErrorObject(
          Errors.INTERNAL_SERVER_ERROR,
          String(err),
          ctx
        );
      }
    },
    authenticate: async (
      _: any,
      { authInput }: AuthInput,
      ctx: CustomContext
    ): Promise<Token> => {
      const { email, password } = authInput;
      const User = await findUserByEmail(email);

      if (!User) {
        throw await generateErrorObject(
          Errors.UNKOWN_USER,
          `A user for ${email} was not found.`,
          ctx
        );
      }

      if (!User.checkPassword(password)) {
        throw await generateErrorObject(
          Errors.WRONG_PASSWORD,
          "Incorrect password.",
          ctx
        );
      }

      try {
        const token = generateJWT(User as User);
        return { token };
      } catch (err) {
        throw await generateErrorObject(
          Errors.INTERNAL_SERVER_ERROR,
          String(err),
          ctx
        );
      }
    },
    initForgotPassword: async (
      _: any,
      { email }: Record<string, string>,
      ctx: CustomContext
    ): Promise<string> => {
      const User = await findUserByEmail(email);

      if (!User) {
        throw await generateErrorObject(
          Errors.UNKOWN_USER,
          `A user for ${email} was not found.`,
          ctx
        );
      }

      try {
        const random = v4().split("-")[0];
        const notified = await notifyUserAboutForgotPassword(User, random);

        if (!notified) {
          throw await generateErrorObject(
            Errors.SMTP_ERROR,
            `There was an error reaching ${User.email}`,
            ctx
          );
        }

        User.tempPassword = random;
        await User.save();

        return `We've sent you a token at ${User.email}`;
      } catch (err) {
        throw await generateErrorObject(
          Errors.INTERNAL_SERVER_ERROR,
          String(err),
          ctx
        );
      }
    },
    finishForgotPassword: async (
      _: any,
      { forgotPasswordInput }: ForgotPasswordInput,
      ctx: CustomContext
    ): Promise<User> => {
      const { email, otp, newPassword, time } = forgotPasswordInput;
      const User = await findUserByEmail(email);

      if (!User) {
        throw await generateErrorObject(
          Errors.UNKOWN_USER,
          `A user for ${email} was not found.`,
          ctx
        );
      }

      const diff = +new Date() - +new Date(String(time));
      const seconds = Math.floor(diff / 1000);

      if (!(seconds < 3600)) {
        throw await generateErrorObject(
          Errors.TIMEOUT,
          "The code used has expired.",
          ctx
        );
      }

      if (!User.checkPassword(otp, true)) {
        throw await generateErrorObject(
          Errors.UNAUTHORIZED,
          "The code provided is invalid.",
          ctx
        );
      }

      User.password = newPassword;
      User.tempPassword = undefined;
      User.tempPasswordTime = undefined;

      const updatedUser = await User.save();
      return updatedUser;
    },
  },
};

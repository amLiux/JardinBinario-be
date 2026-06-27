import { verifyJWT, generateJWT } from "../helpers/authFunctions"
import { findUserByEmail } from "../helpers/findUserByEmail"
import { Errors, generateErrorObject } from "../helpers/Logger"
import { CustomContext, User, Token } from "../types/sharedTypes"

export class LocalAuthProvider {
  static async login(email: string, password: string, ctx: CustomContext): Promise<Token> {
    const User = await findUserByEmail(email)

    if (!User) {
      throw await generateErrorObject(
        Errors.UNKOWN_USER,
        `A user for ${email} was not found.`,
        ctx
      )
    }

    if (!User.checkPassword(password)) {
      throw await generateErrorObject(
        Errors.WRONG_PASSWORD,
        "Incorrect password.",
        ctx
      )
    }

    try {
      const token = generateJWT(User as User)
      return { token }
    } catch (err) {
      throw await generateErrorObject(
        Errors.INTERNAL_SERVER_ERROR,
        String(err),
        ctx
      )
    }
  }

  static verify(token: string): User {
    const User = verifyJWT(token)
    if (!User) throw new Error("Not a valid user")
    return User as User
  }
}

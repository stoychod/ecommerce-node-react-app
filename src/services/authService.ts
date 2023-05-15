import createError from "http-errors";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import UserModel from "../models/userModel";

export default class AuthService {
  userModel: UserModel;
  constructor(db: Pool) {
    this.userModel = new UserModel(db);
  }

  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    // console.log(userData);
    const { email, password, firstName = "", lastName = "" } = userData;

    try {
      const user = await this.userModel.findByOneEmail(email);
      if (user) {
        throw createError(409, "Emali already in use");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await this.userModel.create([
        email,
        hashedPassword,
        firstName,
        lastName,
      ]);

      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw createError(500, error);
      }
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userModel.findByOneEmail(email);
      if (!user) {
        throw createError(401, "Incorrect username or password");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw createError(401, "Incorrect username or password");
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw createError(500, error);
      }
    }
  }
}

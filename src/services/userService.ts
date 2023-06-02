import { Pool } from "pg";
import UserModel from "../models/userModel";
import createHttpError from "http-errors";

export default class UserService {
  userModel: UserModel;
  constructor(db: Pool) {
    this.userModel = new UserModel(db);
  }

  async get(userId: string, authUserId: number) {
    try {
      // allow curently authenticated user to get only their mathicng info
      if (parseInt(userId) !== authUserId) {
        throw createHttpError(401, "Unathorized request");
      }

      const user = this.userModel.findOneById(userId);

      if (!user) {
        throw createHttpError(404, "User record not found");
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error);
      }
    }
  }

  async update(
    authUserId: number,
    userData: {
      id: string;
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
    }
  ) {
    try {
      // allow curently authenticated user to change only their mathicng info
      if (parseInt(userData.id) !== authUserId) {
        throw createHttpError(401, "Unathorized request");
      }

      const updatedUser = await this.userModel.update(userData);

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error);
      }
    }
  }
}

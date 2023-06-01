import { Pool } from "pg";
import UserModel from "../models/userModel";
import createHttpError from "http-errors";

export default class UserService {
  userModel: UserModel;
  constructor(db: Pool) {
    this.userModel = new UserModel(db);
  }

  async get(userId: string, authUserId: string) {
    try {
      // allow curently authenticated user to get only their mathicng info
      if (userId !== String(authUserId)) {
        throw createHttpError(401, "Unathorized request")
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
}

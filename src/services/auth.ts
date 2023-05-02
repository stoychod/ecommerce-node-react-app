import createError from "http-errors";
import userModel from "../models/user";

const authService = {
  register: async (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    // console.log(userData);
    const { email, password, firstName = "", lastName = "" } = userData;

    try {
      const user = await userModel.findByOneEmail(email);
      if (user) {
        throw createError(409, "Emali already in use");
      }

      const newUser = await userModel.create([
        email,
        password,
        firstName,
        lastName,
      ]);

      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw createError(500, error);
      }
    }
  },
};

export default authService;

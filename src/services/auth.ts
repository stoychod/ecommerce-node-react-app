import createError from "http-errors";
import db from "../db";
import bcrypt from "bcrypt";

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
      const user = await db.user.findByOneEmail(email);
      if (user) {
        throw createError(409, "Emali already in use");
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await db.user.create([
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
  },
};

export default authService;

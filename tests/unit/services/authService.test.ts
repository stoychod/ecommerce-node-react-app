import AuthService from "../../../src/services/authService";
import UserModel from "../../../src/models/userModel";
import db from "../../../src/db";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

jest.mock("../../../src/models/userModel");

describe("register", () => {
  it("should throw 409, email already in use", async () => {
    (UserModel as jest.Mock).mockImplementation(() => {
      return {
        findOneByEmail: jest.fn().mockResolvedValue(true),
      };
    });

    try {
      const authService = new AuthService(db);
      await authService.register({
        email: "e@e.com",
        password: "password",
        firstName: "firstName",
        lastName: "lastName",
      });
    } catch (error) {
      expect(error).toEqual(createHttpError(409, "Email already in use"));
    }
  });

  it("should return user with a hashed password", async () => {
    const user = {
      email: "e@e.com",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
    };

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // and replace the plain text one in the user object
    const hashedPassworddUser = { ...user, password: hashedPassword };

    (UserModel as jest.Mock).mockImplementation(() => {
      return {
        findOneByEmail: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(hashedPassworddUser),
      };
    });

    const authService = new AuthService(db);
    const registeredUser = await authService.register(user);
    expect(registeredUser).toEqual(hashedPassworddUser);
  });

  it("should throw 501 error if database call fails", async () => {
    (UserModel as jest.Mock).mockImplementation(() => {
      return {
        findOneByEmail: jest.fn().mockImplementation(() => {
          throw createHttpError(500, "Server error");
        }),
      };
    });

    try {
      const authService = new AuthService(db);
      await authService.register({
        email: "e@e.com",
        password: "password",
        firstName: "firstName",
        lastName: "lastName",
      });
    } catch (error) {
      expect(error).toEqual(createHttpError(500, "Server error"));
    }
  });
});

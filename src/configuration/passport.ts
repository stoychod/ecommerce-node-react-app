import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { Application } from "express";
import authService from "../services/auth";

const configurePassport = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());

  const verifyCallback: VerifyFunction = async (email, password, done) => {
    try {
      console.log(
        `Verifying user with email: ${email}\n and password: ${password}`
      );
      const user = await authService.login(email, password);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user}`);
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    console.log(`Deserializing user with id: ${id}`);
    done(null, { id });
  });

  passport.use(new LocalStrategy({ usernameField: "email" }, verifyCallback));

  return passport;
};

export default configurePassport;

import express, { Application } from "express";
import { Pool } from "pg";
import { PassportStatic } from "passport";
import AuthService from "../services/authService";
import validateUser from "../middleware/validateUser";

const router = express.Router();

const authRouter = (app: Application, passport: PassportStatic, db: Pool) => {
  const authService = new AuthService(db);

  app.use("/auth", router);

  router.post("/register", validateUser, async (req, res) => {
    const userData = req.body;

    const registeredUser = await authService.register(userData);

    res.status(200).send(registeredUser);
  });

  router.post("/login", passport.authenticate("local"), async (req, res) => {
    console.log(req.session);
    console.log(req.user);

    return res.status(200).send(req.user);
  });
};

export default authRouter;

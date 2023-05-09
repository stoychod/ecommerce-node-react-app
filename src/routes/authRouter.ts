import express, { Application } from "express";
const router = express.Router();
import authService from "../services/authService";
import { PassportStatic } from "passport";

const authRouter = (app: Application, passport: PassportStatic) => {
  app.use("/auth", router);

  router.post("/register", async (req, res, next) => {
    try {
      // console.log(req)
      const userData = req.body;
      const registeredUser = await authService.register(userData);
      res.status(200).send(registeredUser);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
      console.log(req.session);
      console.log(req.user);
      return res.status(200).send(req.user);
    }
  );

  router.get("/products", async (req, res) => {
    console.log(req.session);
    console.log(req.user);
    res.status(200).send("Apples, Mangos, Watermellons");
  });
};

export default authRouter;

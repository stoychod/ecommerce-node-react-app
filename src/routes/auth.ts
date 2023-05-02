import express, { Application } from "express";
const router = express.Router();
import authService from "../services/auth";

const authRouter = (app: Application) => {
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
};

export default authRouter;

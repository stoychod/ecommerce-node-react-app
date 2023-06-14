import express, { Application } from "express";
import { Pool } from "pg";
import { PassportStatic } from "passport";
import AuthService from "../services/authService";
// import validateUser from "../middleware/validateUser";

const router = express.Router();

const authRouter = (
  app: Application,
  passport: PassportStatic,
  db: Pool,
  routePrefix: string
) => {
  const authService = new AuthService(db);

  app.use(`${routePrefix}/auth`, router);

  router.post("/register", async (req, res) => {
    const userData = req.body;

    const registeredUser = await authService.register(userData);

    res.status(200).send(registeredUser);
  });

  router.post("/login", passport.authenticate("local"), async (req, res) => {
    console.log(req.session);
    console.log(req.user);

    return res.status(200).send(req.user);
  });

  router.get("/checkAuthentication", (req, res) => {
    const authenticated = req.user !== undefined;

    res.status(200).send(authenticated);
  });
};

export default authRouter;

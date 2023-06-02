import express, { Application } from "express";
import { Pool } from "pg";
import UserService from "../services/userService";
import validateUser from "../middleware/validateUser";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();

const userRouter = (app: Application, db: Pool) => {
  const userService = new UserService(db);

  app.use("/users", router);

  router.get("/:userId", isAuthenticated, async (req, res) => {
    const authUserId = req.user?.id;
    if (authUserId) {
      const userId = req.params.userId;
      const user = await userService.get(userId, authUserId);

      res.status(200).send(user);
    }
  });

  router.put("/:userId", isAuthenticated, validateUser, async (req, res) => {
    const authUserId = req.user?.id;
    if (authUserId) {
      const userId = req.params.userId;
      const updatedUser = await userService.update(authUserId, {
        id: userId,
        ...req.body,
      });

      res.status(200).send(updatedUser);
    }
  });
};

export default userRouter;

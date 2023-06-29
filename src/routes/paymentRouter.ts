import express, { Application } from "express";
import PaymentService from "../services/paymentService";

const router = express.Router();

const paymentRouter = (app: Application, routePrefix: string) => {
  const paymentService = new PaymentService();
  app.use(`${routePrefix}/payment`, router);

  router.get("/config", async (req, res) => {
    const pubKey = await paymentService.getPubKey();
    res.send({ publishableKey: pubKey });
  });
};

export default paymentRouter;

import { Pool } from "pg";
import express, { Application } from "express";
import PaymentService from "../services/paymentService";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();

const paymentRouter = (app: Application, db: Pool, routePrefix: string) => {
  const paymentService = new PaymentService(db);
  app.use(`${routePrefix}/payment`, router);

  router.get("/config", async (req, res) => {
    const pubKey = await paymentService.getPubKey();
    res.send({ publishableKey: pubKey });
  });

  router.post("/create-payment-intent", isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    if (userId) {
      const clientSecret = await paymentService.createPaymentIntent(userId);
      res.status(200).send({ clientSecret: clientSecret });
    }
  });

  router.post("/webhook", express.raw({type: "application/json"}),  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const rawBody = req.body;

    if (typeof signature === "string") {
      await paymentService.handleEvent(signature, rawBody);
    }
    res.status(200).send();
  });
};

export default paymentRouter;

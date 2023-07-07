import "express-async-errors";
import path from "path";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

const configureExpress = (app: Application) => {
  // parse request with json payloads
  // app.use(express.json());

  // Use JSON parser for all non-webhook routes
  app.use((req, res, next) => {
    if (req.originalUrl === "/api/payment/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  // parse request wiht urlencoded payloads
  app.use(express.urlencoded({ extended: true }));

  // enable cors
  app.use(cors());

  // log incoming requests
  app.use(morgan("combined"));

  // serve static react files
  const pathName = path.join(__dirname, "..", "..", "static");
  app.use(express.static(pathName));
};

export default configureExpress;

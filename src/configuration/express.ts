import "express-async-errors";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

const configureExpress = (app: Application) => {
  // parse request with json payloads
  app.use(express.json());

  // parse request wiht urlencoded payloads
  app.use(express.urlencoded({ extended: true }));

  // enable cors
  app.use(cors());

  // log incoming requests
  app.use(morgan("combined"));
};

export default configureExpress;

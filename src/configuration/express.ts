import "express-async-errors"
import express, { Application } from "express";
import morgan from "morgan";

const configureExpress = (app: Application) => {
  // parse request with json payloads
  app.use(express.json());

  // parse request wiht urlencoded payloads
  app.use(express.urlencoded({ extended: true }));

  // log incoming requests
  app.use(morgan("combined"));
};

export default configureExpress;

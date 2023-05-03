import express, { Application } from "express";

const configureExpress = (app: Application) => {
  // parse request with json payloads
  app.use(express.json());

  // parse request wiht urlencoded payloads
  app.use(express.urlencoded());
};

export default configureExpress;

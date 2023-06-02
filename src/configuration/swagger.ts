import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { Application } from "express";

const configureSwagger = (app: Application) => {
  const file = fs.readFileSync("./swagger.yaml", "utf8");
  const swaggerDocument = YAML.parse(file);
  console.log(swaggerDocument)

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default configureSwagger;

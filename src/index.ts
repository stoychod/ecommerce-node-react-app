import { PORT } from "./environment";
import express from "express";
import configureApplication from "./configuration";

const app = express();
const port = PORT || 3000;

app.use(express.json());
configureApplication(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

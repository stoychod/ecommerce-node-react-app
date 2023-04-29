import { PORT } from "./environment";
import express from "express";
import query from "./db";

const app = express();
const port = PORT || 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/users", (req, res) => {
  query("SELECT * FROM users", [])
    .then((result) => res.send(result.rows[0]))
    .catch((err) => console.log(err));
  // res.send("Hello, Stoycho");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

import { PORT } from "./environment";
import createApp from "./app";
import db from "./db";

const app = createApp(db);
const port = PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

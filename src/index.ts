import { PORT } from "./environment";
import createApp from "./app";
import db from "./db";
import logger from "./logger/logger";

const app = createApp(db);
const port = PORT || 3000;

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

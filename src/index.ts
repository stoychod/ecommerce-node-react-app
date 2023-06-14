import { PORT, ROUTE_PREFIX } from "./environment";
import createApp from "./app";
import db from "./db";
import logger from "./logger/logger";

const prefix = ROUTE_PREFIX;
const app = createApp(db, prefix);
const port = PORT || 3000;

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

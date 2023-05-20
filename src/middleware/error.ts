import { HttpError } from "http-errors";
import logger from "../logger/logger";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  const { status, message } = err;
  return res.status(status).send({ message });
};

export default errorMiddleware;

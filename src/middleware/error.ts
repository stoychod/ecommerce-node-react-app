import { HttpError } from "http-errors";
import logger from "../logger/logger";
import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  if (err instanceof HttpError) {
    const { status, message } = err;
    return res.status(status).send({ message });
  }

  return res.status(500).send({ message: "Server error" });
};

export default errorMiddleware;

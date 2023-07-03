import { Response, Request, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send("Login to access this resource");
};

export default isAuthenticated;

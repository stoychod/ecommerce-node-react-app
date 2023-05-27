import { Response, Request, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/auth/login");
};

export default isAuthenticated;

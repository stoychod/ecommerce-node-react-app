import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import JoiPasswordComplexity from "joi-password-complexity";
import logger from "../logger/logger";

const complexityOptions = {
  min: 10,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 5,
};

const userSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().max(255).required(),
  password: JoiPasswordComplexity(complexityOptions).required(),
});

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.body;
  logger.debug(`Validating user: ${user}`);
  const { error } = userSchema.validate(user);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

export default validateUser;

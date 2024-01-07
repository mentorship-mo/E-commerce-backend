import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error/custom-error";

export const errorHandlerMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("HII");
  res.send("SSS");
  if (err instanceof CustomError) {
    return res
      .sendStatus(err.statusCode)
      .send({ errors: err.serializeErrors() });
  }
  console.log(err);
  res.sendStatus(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};

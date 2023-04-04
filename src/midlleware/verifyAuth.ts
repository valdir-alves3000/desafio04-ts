import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function verifyAuth(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (authToken) {
    const [, token] = authToken.split(" ");

    try {
      const { sub } = verify(token, "5dws25wf5wf2d58sv2dq5c212");
      return next;
    } catch (error) {
      return response.status(401).json({ message: "Unauthorized!" });
    }
  }

  return response.status(401).json({ message: "Unauthorized!" });
}

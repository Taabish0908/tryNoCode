import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Token } from "../models/token";
import { AppDataSource } from "../data-source";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload | { id: number; role: string };
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRECT_KEY as string
    ) as JwtPayload;

    const tokenRepository = AppDataSource.getRepository(Token);
    const savedToken = await tokenRepository.findOne({
      where: { token: token, user: { id: decoded.id }, isActive: true },
    });

    if (!savedToken) {
      res.status(401).json({
        message: "Unauthorized: Token is no longer valid or inactive",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    return;
  }
};

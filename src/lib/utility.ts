import { Response } from "express";
import jwt from "jsonwebtoken";

interface User {
  _id: string;
}

export const sendToken = (
  res: Response,
  user: User,
  code: number,
  message: string
): Response => {
  const token = jwt.sign(
    { id: user._id },
    process.env.SECRECT_KEY as string 
    //   {
    //   expiresIn: "15d",
    // }
  );

  return res
    .status(code)
    .cookie("user-token", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      sameSite: "none",
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      user,
      message,
    });
};

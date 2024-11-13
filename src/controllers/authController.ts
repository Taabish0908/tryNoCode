import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { AppDataSource } from "../data-source";
import { console } from "inspector";
import { Token } from "../models/token";
import { logToFile } from "../lib/logger";

export const register = async (req: Request, res: Response): Promise<void> => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/

  const { username, email, password, role } = req.body;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // Validate password format
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message: "Password must be at least 5 characters long and contain at least 1 letter, 1 number, and 1 special character",
    });
    return;
  }

  let existingUser = await AppDataSource.getRepository(User).findOne({
    where: [
      { email: email },
      { username: username }
    ]
  });
  

  if (existingUser) {
    res.status(400).json({ message: "User already exists with this email or username" });
    return
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const roleRepository = AppDataSource.getRepository(Role);
    const userRepository = AppDataSource.getRepository(User);

    const roleEntity = await roleRepository.findOneBy({ name: role });
    console.log(roleEntity, "role entity");
    if (!roleEntity) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: roleEntity,
      // role
    });

    await userRepository.save(newUser);

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role.name },
      // "your_secret_key",
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role.name,
      },
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const tokenRepository = AppDataSource.getRepository(Token);

  const user = await AppDataSource.getRepository(User).findOne({
    where: { email },
    relations: ["role"],
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role.name },
    "your-secret-key",
    { expiresIn: "1h" }
  );
  const newToken = tokenRepository.create({
    token,
    user: user,
    isActive: true,
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  });
  await tokenRepository.save(newToken);

  res.json({ token });
};

// Logout function
export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(req.headers, "headers");
  console.info(token, "token");
  console.log(token, "token");
  if (!token) {
    res.status(400).json({ message: "Token not found..", token:token });
    return;
  }

  try {
    const tokenRepository = AppDataSource.getRepository(Token);


    const savedToken = await tokenRepository.findOne({
      where: { token: token },
    });

    if (!savedToken) {
      res.status(404).json({ message: "Token not found",  "token": token, "savedToken": savedToken });
    } else {
      savedToken.isActive = false;
      await tokenRepository.save(savedToken);
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout" });
  }
};




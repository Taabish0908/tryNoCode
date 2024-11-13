import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../models/User";

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    const { user } = req; 
    let fullUser;
    try {
      const userRepository = AppDataSource.getRepository(User);
      if(user){
        fullUser = await userRepository.findOne({
          where: { id: user.id },
          relations: ["role"],
        });
      }
      
  
      if (!fullUser) {
        res.status(404).json({ message: "User not found" });
        return
      }
  
      // Removing the password field before sending the response
      const { password, ...userWithoutPassword } = fullUser;
  
      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
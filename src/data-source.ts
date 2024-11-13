import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Product } from "./models/Product";
import { Order } from "./models/Order";
import { Role } from "./models/Role";
import { Token } from "./models/token";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mssql",
  // host: "localhost",
  host: process.env.HOST,
  port: 1433,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: "myDb",
  synchronize: false,
  logging: true,
  entities: [User, Product, Order, Role, Token],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});

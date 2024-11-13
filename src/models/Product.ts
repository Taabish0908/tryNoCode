import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User"; // Make sure to import the User entity

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price?: number;

  @Column({ default: 0 })
  stock?: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

 
  @ManyToOne(() => User)  
  @JoinColumn({ name: "createdBy" })  
  createdBy!: User;
}

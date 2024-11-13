import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  // Use varchar or nvarchar instead of enum for SQL Server
  @Column({ type: "varchar", length: 50, default: "user" }) 
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

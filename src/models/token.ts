import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  token?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "bit", default: true })
  isActive?: boolean;

  @Column({ type: "datetime2", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "datetime2", nullable: true })
  expires_at?: Date;
}

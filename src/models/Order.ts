import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })  // Foreign key column `user_id`
  user!: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })  // Foreign key column `product_id`
  product!: Product;

  @Column({ default: 1 })
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total_price!: number;

  @CreateDateColumn()
  order_date!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

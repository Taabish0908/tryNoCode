## Project - Try No Code
### Objective
- Develop a Node.js server using Express and `TypeScript`, integrated with a `SQL` database using `TypeORM`.
- The server will manage four primary entities: `User, Product, Order, and Role`, with Role assigned during user registration.
- Implement JWT authentication for secure access to specific routes.
- Additionally, the assignment includes developing APIs for user registration, product management, and order handling.


### Requirement
- Install Node.js and TypeScript.
- Download and configure SQL Server Management Studio (SSMS) to manage and view SQL data.
- Set up a SQL database and configure TypeORM to connect to it.

### Project Structure

src/

├── controllers/    # For route handler logic

├── middlewares/    # For custom middleware functions

├── models/         # For TypeORM entities (User, Product, Order, Role)

├── routes/         # For routing logic

├── lib/            # For validation utilities

└── server.ts       # Entry point for the server


### Models
- User Model
```yaml
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  role!: Role;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

```


- Order Model
```yaml
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


```

-Product Model
```yaml
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

```

-Role Model
```yaml
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
```


### Submission Checklist
- Set up Express server with TypeScript.
- Connect the server to SQL Server using TypeORM.
- Implement database models (User, Role, Product, Order) with appropriate relationships.
- Configure JWT authentication for secure route access.
- Develop all specified routes with validation and middleware.
- Test the application, verify database entries, and confirm secure access to protected routes.

### Some End-Point Response

- when username or email already exist in database


```yaml

{
   "username":"systemuser",
   "role":"user",
    "email":"anyone1@gmail.com",
    "password":"123abc@"
}

{
    "message": "User already exists with this email or username"
}
```

- Successfull Login

```yaml

{
   "username":"iromman6",
   "role":"admin",
    "email":"ironman6@gmail.com",
    "password":"ironman@1"
}


{
    "message": "User registered successfully",
    "user": {
        "id": 12,
        "username": "iromman6",
        "email": "ironman6@gmail.com",
        "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzE1MDc4MDIsImV4cCI6MTczMTUxMTQwMn0.3kjwuwnXuzOXy3b_nHJjU40ASGzjgKrGs_ojlRypJQ8"
}

```
### get Product

```yaml
localhost:3000/product/get-products?page=1&limit=2

{
    "products": [
        {
            "id": 1,
            "name": "book",
            "description": "a book",
            "price": 10,
            "stock": 3,
            "createdAt": "2024-11-13T09:54:34.726Z",
            "updatedAt": "2024-11-13T10:24:53.740Z",
            "createdBy": {
                "id": 1,
                "name": "taabish"
            }
        },
        {
            "id": 2,
            "name": "pen",
            "description": "a pen",
            "price": 10,
            "stock": 2,
            "createdAt": "2024-11-13T09:57:21.763Z",
            "updatedAt": "2024-11-13T09:57:21.763Z",
            "createdBy": {
                "id": 1,
                "name": "taabish"
            }
        }
    ],
    "currentPage": 1,
    "totalPages": 2,
    "totalCount": 4
}
```

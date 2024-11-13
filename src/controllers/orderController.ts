import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user } = req; 
  const { product_id, quantity } = req.body;
  let currentUser;
  let total_price;
  try {
    if (user) {
      currentUser = await AppDataSource.getRepository(User).findOneBy({
        id: user.id,
      });
    }

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const product = await AppDataSource.getRepository(Product).findOneBy({
      id: product_id,
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.stock) {
      if (product.stock < quantity) {
        res.status(400).json({
          message: `Insufficient stock. Available quantity: ${product.stock}`,
        });
        return;
      }
    }

    if (product.price) {
      total_price = product.price * quantity;
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const newOrder = orderRepository.create({
      user: currentUser,
      product: product,
      quantity,
      total_price,
    });

    await orderRepository.save(newOrder);

    if (product.stock) {
      product.stock -= quantity;
    }
    await AppDataSource.getRepository(Product).save(product);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
    return;
  } catch (error) {
    console.log("Error creating order", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getOrdersForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user } = req;

  try {
    let orders;
    let productTotalPrice = 0;
    const orderRepository = AppDataSource.getRepository(Order);
    if (user) {
      orders = await orderRepository.find({
        where: { user: { id: user.id } },
        relations: ["product"],
      });
      if (orders.length === 0) {
        res.status(404).json({ message: "No orders found for this user" });
        return;
      }
    }

    let totalProductCount = 0;
    let totalPrice = 0;
    const orderDetails = orders?.map((order) => {
      const product = order.product;
      const orderQuantity = order.quantity;
      if (product.price) {
        productTotalPrice = product.price * orderQuantity;
      }

      // Update totals
      totalProductCount += orderQuantity;
      totalPrice += productTotalPrice;

      return {
        product_name: product.name,
        quantity: orderQuantity,
        price: product.price,
        total_price: productTotalPrice,
      };
    });

    // Send response with order details and totals
    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: orderDetails,
      total_product_count: totalProductCount,
      total_order_price: totalPrice,
    });
    return
  } catch (error) {
    console.log("Error retrieving orders", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

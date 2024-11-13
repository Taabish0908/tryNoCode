import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../models/Product";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, stock, createdBy } = req.body;

    const productRepository = AppDataSource.getRepository(Product);

    const newProduct = productRepository.create({
      name,
      description,
      price,
      stock,
      createdBy,
    });

    await productRepository.save(newProduct);

    res.status(201).json({ message: "Product created successfully" });
    return;
  } catch (error) {
    console.log("error creating product", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};


export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;  // Default to page 1 if not provided
      const limit = parseInt(req.query.limit as string) || 10;  // Default to 10 products per page
  
      const offset = (page - 1) * limit;
  
      const productRepository = AppDataSource.getRepository(Product);
  
      const totalCount = await productRepository.count();
  
      const products = await productRepository.find({
        relations: ["createdBy"], 
        skip: offset, 
        take: limit, 
      });
  
      const mappedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        createdBy: {
          id: product.createdBy.id, 
          name: product.createdBy.username,
        }
      }));
  
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
      res.status(200).json({
        products: mappedProducts,
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,  // Total number of products in the database
      });
    } catch (error) {
      console.log("Error getting products", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


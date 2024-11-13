import Joi from "joi";

export const addProduct = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional().allow('', null),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    createdBy: Joi.number().required(),
});

export const registerUserValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
});

export const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const createOrderValidation = Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().required(),
});

export const getProductsValidation = Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
});
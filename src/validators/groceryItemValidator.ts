import Joi from 'joi';

export const groceryItemSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  price: Joi.number().precision(2).required().messages({
    'number.base': 'Price must be a float',
    'any.required': 'Price is required',
  }),
  quantity: Joi.number().integer().required().messages({
    'number.base': 'Quantity must be an integer',
    'any.required': 'Quantity is required',
  }),
});

export const inventorySchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'Id must be an integer',
    'any.required': 'Id is required',
  }),
  quantity: Joi.number().integer().required().messages({
    'number.base': 'Quantity must be an integer',
    'any.required': 'Quantity is required',
  }),
});

export const placeOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        itemId: Joi.number().integer().required().messages({
          "string.base": "Item ID must be a Int",
          "any.required": "Item ID is required",
        }),
        quantity: Joi.number().integer().positive().required().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.positive": "Quantity must be greater than zero",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required",
      "any.required": "Items are required",
    }),
});

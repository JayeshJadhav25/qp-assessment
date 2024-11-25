import Joi from 'joi';

export const registerValidationSchema = Joi.object({
    username: Joi.string()
      .required()
      .messages({
        'string.base': 'Username must be a string.',
        'string.empty': 'Username is required.',
        'any.required': 'Username is required.',
      }),
    password: Joi.string()
      .min(8)
      .max(30)
      .required()
      .messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must be at most 30 characters long.',
        'any.required': 'Password is required.',
      }),
    role: Joi.string()
      .valid('admin', 'user')
      .required()
      .messages({
        'string.base': 'Role must be a string.',
        'any.only': 'Role must be either "admin" or "user".',
        'any.required': 'Role is required.',
      }),
  });


export const loginValidationSchema = Joi.object({
    username: Joi.string()
      .required()
      .messages({
        'string.base': 'Username must be a string.',
        'string.empty': 'Username is required.',
        'any.required': 'Username is required.',
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.',
      }),
  });
import Joi from 'joi';

// Product validation schema
export const productSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().greater(0).required(),
  imageUrl: Joi.string().allow('').optional(),
  productionDate: Joi.date().optional(),
  expiryDate: Joi.date().optional(),
  categoryId: Joi.string().uuid().required(),
  subCategoryId: Joi.string().uuid().required(),
  brandId: Joi.string().uuid().required(),
});

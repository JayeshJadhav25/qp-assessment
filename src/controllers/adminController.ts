import { Request, Response, NextFunction } from 'express';
import db from '../config/database';
import { groceryItemSchema, inventorySchema } from '../validators/groceryItemValidator';
import { ValidationException, ServiceException, NotFoundException } from '../exception/index';

// Add a new grocery item
export const addGroceryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {

    const { error } = groceryItemSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(new ValidationException(error.details.map((err) => err.message)));
    }

    const { name, price, quantity } = req.body;

    const [result] = await db.query(
      'INSERT INTO grocery_items (name, price, quantity) VALUES (?, ?, ?)',
      [name, price, quantity]
    );
    res.status(201).json({
      success: true,
      message: 'Grocery item added',
      id: (result as any).insertId,
    });
  } catch (error: any) {
    next(new ServiceException(error));
  }
};

// View all grocery items
export const getGroceryItems = async (req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [rows]: any[] = await db.query('SELECT * FROM grocery_items');

    res.status(200).json({
      success: true,
      message: rows.length === 0 ? 'No grocery items found' : "success",
      result: rows
    });

  } catch (error: any) {
    next(new ServiceException(error));
  }
};

// Update a grocery item
export const updateGroceryItem = async (req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const { error } = groceryItemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(new ValidationException(error.details.map((err) => err.message)));
  }

  const { id } = req.params;
  const { name, price, quantity } = req.body;
  try {

    const [rows]: any[] = await db.query('SELECT * FROM grocery_items where id = ?', [id]);

    if (!rows || rows.length == 0) {
      return next(new NotFoundException('Grocery Id Not Found'));

    }

    await db.query(
      'UPDATE grocery_items SET name = ?, price = ?, quantity = ? WHERE id = ?',
      [name, price, quantity, id]
    );
    res.status(200).json({
      success: true,
      message: 'Grocery item updated'
    });

  } catch (error: any) {
    next(new ServiceException(error));
  }
};

// Delete a grocery item
export const deleteGroceryItem = async (req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    const [rows]: any[] = await db.query('SELECT * FROM grocery_items where id = ?', [id]);

    if (!rows || rows.length == 0) {
      return next(new NotFoundException('Grocery Id Not Found'));

    }

    await db.query('DELETE FROM grocery_items WHERE id = ?', [id]);
    res.status(200).json({
      success: true,
      message: 'Grocery item deleted'
    });
  } catch (error: any) {
    next(new ServiceException(error));
  }
};

// Manage inventory levels
export const manageInventory = async (req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id, quantity } = req.body;

  const { error } = inventorySchema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(new ValidationException(error.details.map((err) => err.message)));
  }

  try {
    await db.query('UPDATE grocery_items SET quantity = ? WHERE id = ?', [
      quantity,
      id,
    ]);
    res.status(200).json({
      success: true,
      message: 'Inventory level updated'
    });
  } catch (error: any) {
    next(new ServiceException(error));
  }
};

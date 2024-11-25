import { Request, Response, NextFunction } from 'express';
import db from '../config/database';
import { ValidationException, ServiceException, NotFoundException } from '../exception/index';
import { placeOrderSchema } from '../validators/groceryItemValidator';
import { OrderItem, GroceryItem } from '../interface/OrderItem';

export const viewGroceryItems = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const [items] = await db.query('SELECT * FROM grocery_items WHERE quantity > 0');
        res.status(200).json({
            success: true,
            result: items
        });
    } catch (error: any) {
        next(new ServiceException(error));
    }
}

export const placeOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { items } = req.body;

    try {
        const userData = (req as any).user;
        const userId = userData.id;

        const { error } = placeOrderSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return next(new ValidationException(error.details.map((err) => err.message)));
        }

        const itemIds = items.map((item: OrderItem) => item.itemId);
        const [groceryItems]: any[] = await db.query(
            `SELECT id, price, quantity FROM grocery_items WHERE id IN (${itemIds.map(() => '?').join(',')})`,
            itemIds
        );

        if (groceryItems.length !== items.length) {
            return next(new NotFoundException('Some items are not found in the inventory'));
        }

        let totalAmount = 0;
        const inventoryUpdates: [number, number][] = [];
        const orderItemsData: [number, number, number][] = [];

        for (const item of items) {
            const groceryItem = groceryItems.find((g: GroceryItem) => g.id === item.itemId);
            if (!groceryItem || groceryItem.quantity < item.quantity) {
                return next(new ValidationException(`Insufficient inventory for item with ID ${item.itemId}`));
            }

            totalAmount += groceryItem.price * item.quantity;
            inventoryUpdates.push([groceryItem.id, groceryItem.quantity - item.quantity]);
            orderItemsData.push([item.itemId, item.quantity, groceryItem.price]);
        }

        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                await db.query('START TRANSACTION');

                const [orderResult] = await db.query(
                    'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
                    [userId, totalAmount]
                );
                const orderId = (orderResult as any).insertId;

                const orderItemsValues = orderItemsData.map((item) => [orderId, ...item]);
                await db.query(
                    'INSERT INTO order_items (order_id, grocery_item_id, quantity, price) VALUES ?',
                    [orderItemsValues]
                );

                const updateQuery = `
                        UPDATE grocery_items
                        SET quantity = CASE
                        ${inventoryUpdates.map((item) => `WHEN id = ? THEN ?`).join(' ')}
                        ELSE quantity
                        END
                        WHERE id IN (${inventoryUpdates.map(() => '?').join(',')});
                    `;

                const queryParams = inventoryUpdates.reduce((acc, item) => {
                    acc.push(item[0], item[1]); // Add itemId and new quantity
                    return acc;
                }, [] as any[]);

                queryParams.push(...inventoryUpdates.map(item => item[0]));

                await db.query(updateQuery, queryParams);

                await db.query('COMMIT');

                res.status(201).json({
                    message: 'Order placed successfully',
                    orderId,
                    totalAmount,
                });
                return;
            } catch (error: any) {
                await db.query('ROLLBACK');
                if (error.code === 'ER_LOCK_WAIT_TIMEOUT') {
                    attempt++;
                    if (attempt === maxRetries) {
                        next(new ServiceException('Transaction failed after retries.'));
                        return;
                    }
                } else {
                    next(new ServiceException(error));
                    return;
                }
            }
        }
    } catch (error: any) {
        next(new ServiceException(error.message));
    }
};



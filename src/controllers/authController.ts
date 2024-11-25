import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import { Request, Response, NextFunction } from 'express';
import { ValidationException, ServiceException, AuthFailedException } from '../exception/index';
import { registerValidationSchema, loginValidationSchema } from '../validators/authValidator';

const SECRET_KEY = process.env.JWT_SECRET || 'grocerysecret';

// User Registration
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const { error } = registerValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return next(new ValidationException(error.details.map((err) => err.message)));
        }

        const { username, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error: any) {
        next(new ServiceException(error));
    }
};

// User Login
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { username, password } = req.body;

    try {

        const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return next(new ValidationException(error.details.map((err) => err.message)));
        }

        const [result]: any[] = await db.query('SELECT * FROM users where username = ? ', [username]);

        if (result.length === 0) {
            return next(new AuthFailedException('Invalid username or password'));
        }

        const user = result[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new AuthFailedException('Invalid username or password'));
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ 
            success: true,
            message: 'Login successful', 
            token 
        });
    } catch (error: any) {
        next(new ServiceException(error));
    }
};

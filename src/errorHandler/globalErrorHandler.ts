import type { Request, Response, NextFunction } from 'express';

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("Global Error Handler:", err.message, err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const details = err.detail || null;
    if (details) {
        res.status(statusCode).json({ Code: statusCode, Message: message, Details: details });
        return;
    }
    res.status(statusCode).json({ Code: statusCode, Message: message });
}
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error.code === 'P2002') {
    res.status(400).json({
      error: 'Duplicate entry',
      message: 'A record with this information already exists',
    });
    return;
  }

  if (error.code === 'P2025') {
    res.status(404).json({
      error: 'Record not found',
      message: 'The requested resource was not found',
    });
    return;
  }

  // Validation errors
  if (error.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid input data',
      details: error.errors,
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication token is invalid',
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired',
      message: 'Authentication token has expired',
    });
    return;
  }

  // Default error
  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
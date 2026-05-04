import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import config from '../config.js';

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        if (!token) {
            return res.status(401).json({
                error: 'Access denied',
                message: 'No token provided'
            });
        }

        const jwtSecret = config.security?.jwtSecret || process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;

        logger.debug(`Authenticated request: ${req.method} ${req.path}`, {
            user: decoded.username,
            ip: req.ip || req.connection?.remoteAddress
        });

        next();
    } catch (error) {
        logger.warn('Authentication failed:', {
            error: error.message,
            ip: req.ip || req.connection?.remoteAddress,
            path: req.path
        });

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Please login again'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'Please provide a valid token'
            });
        }

        return res.status(401).json({
            error: 'Authentication failed',
            message: 'Invalid or malformed token'
        });
    }
};

export const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        if (token) {
            const jwtSecret = config.security?.jwtSecret || process.env.JWT_SECRET || 'fallback-secret';
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
        }

        next();
    } catch (error) {
        logger.debug('Optional auth failed, continuing without user:', error.message);
        next();
    }
};

export const adminAuthMiddleware = (req, res, next) => {
    authMiddleware(req, res, (err) => {
        if (err) return next(err);

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Access denied',
                message: 'Admin privileges required'
            });
        }

        next();
    });
};

export const secureAuthMiddleware = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    authMiddleware(req, res, next);
};

export default authMiddleware;

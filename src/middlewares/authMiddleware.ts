import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    const authHeader: string = req.headers?.authorization || '';
    const refreshToken = req.cookies?.refreshToken;

    const token = authHeader.split(' ')[1];
    console.log("authorization: ", authHeader);
    console.log("cookie: ", req.cookies);

    if (!refreshToken) {
        return res.status(401).send('Unauthorized, no refresh token provided');
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided in authorization header" });
    }

    const privateKey: string = process.env.JWT_PRIVATE_KEY || 'tes';

    let userDecoded: jwt.JwtPayload | string;
    try {
        userDecoded = jwt.verify(token, privateKey);
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    try {
        if (typeof userDecoded !== 'string' && userDecoded.email) {
            // email or username
            req.email = userDecoded.email;
            next();
        } else {
            return res.status(400).json({ message: "Invalid token payload structure" });
        }
    } catch (err) {
        console.error("Auth middleware error: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
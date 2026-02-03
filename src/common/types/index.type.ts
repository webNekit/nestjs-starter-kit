import {Request} from 'express';
import {Role} from "@prisma/client";

export interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        role: Role;
    };
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}

export type TokenPair = {
    accessToken: string;
    refreshToken: string;
};
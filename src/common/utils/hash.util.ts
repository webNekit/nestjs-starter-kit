import * as argon2 from 'argon2';

export const hashString = async (plain: string): Promise<string> => {
    return argon2.hash(plain);
};

export const verifyString = async (
    hash: string,
    plain: string,
): Promise<boolean> => {
    try {
        return await argon2.verify(hash, plain);
    } catch (error) {
        return false;
    }
};
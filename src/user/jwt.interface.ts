export interface JwtPayload {
    username: string;
    sub: number; // Typically the user ID
    // You can also add other fields if needed, for example:
    // email: string;
    // roles: string[];
}

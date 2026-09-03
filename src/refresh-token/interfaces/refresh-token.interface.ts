export interface RefreshToken {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
}
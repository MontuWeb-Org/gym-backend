import { Role } from '@generated/prisma/enums';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
  role: Role;
}

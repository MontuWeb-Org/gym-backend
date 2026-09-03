import { CustomJwtPayload } from './jwt-payload.type';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

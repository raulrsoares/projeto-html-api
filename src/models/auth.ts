import { JwtPayload } from 'jsonwebtoken';
import { ExpirationInType } from '../types/jwtTypes';

export interface JwtPayloadApplication extends JwtPayload {
  sub: string; // ID do usuário
  role: string;
  exp?: number;
  nbf?: number;
  jti?: string;
}

export interface CriarTokenParams {
  userId: string;
  expiresIn?: ExpirationInType | string;
}

export interface RequestBody {
  email: string;
  senha: string;
}
export interface ResponseBody {
  auth: string;
  role: string;
}

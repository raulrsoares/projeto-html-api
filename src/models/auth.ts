import { JwtPayload } from 'jsonwebtoken';

export interface JwtPayloadApplication extends JwtPayload {
  sub: string; // ID do usuário
  role: string;
  exp?: number;
  nbf?: number;
  jti?: string;
}

export interface RequestBody {
  email: string;
  senha: string;
}

export interface ResponseBody {
  authorization: string;
  role: string;
  id: string;
}

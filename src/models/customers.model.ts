export interface RequestBody {
  name: string;
  lastName: string;
  email: string;
  password: string;
  cep: string;
  endereco: string;
  bairro: string;
  estado: string;
  numero: number;
  role?: 'admin' | 'default';
}

export interface PutRequestBody extends RequestBody {
  isActive: boolean;
}

export interface ResponseBody {
  authorization: string;
  role: string;
}

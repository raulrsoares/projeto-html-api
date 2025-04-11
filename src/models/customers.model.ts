export interface RequestBody {
  name: string;
  lastName: string;
  email: string;
  password: string;
  cpf: string;
  role?: 'admin' | 'default';
}

export interface ResponseBody {
  authorization: string;
  role: string;
}

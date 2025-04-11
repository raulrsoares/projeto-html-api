export interface UserInterface {
  _id: string;
  index: number;
  isActive: boolean;
  name: string;
  lastName: string;
  email: string;
  password: string;
  cpf: number;
  registered: string;
  role: 'admin' | 'default';
}

export type UserListType = UserInterface[];

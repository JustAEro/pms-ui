export type Admin = {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
};

export type CreateAdmin = Admin & {
  password: string;
};

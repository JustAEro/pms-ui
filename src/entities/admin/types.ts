export type Admin = {
  login: string;
  firstName: string;
  lastName: string;
};

export type CreateAdmin = Admin & {
  password: string;
};

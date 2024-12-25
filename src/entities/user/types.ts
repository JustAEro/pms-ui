import { Project } from '../project';

export type UserType = 'user' | 'admin' | null;

export type UserDto = {
  userId?: string;
  firstName: string;
  lastName: string;
  position: string;
  isAdmin: boolean;
  login: string;
  password: string;
};

export type User = {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  projects: Project[];
  canCreateProjects: boolean;
  userType: UserType;
  password: string;
  position: string;
};

export type UpdateUserMeta = Pick<
  User,
  'id' | 'login' | 'firstName' | 'lastName' | 'password'
>;

// export type AddUser = {
//   login: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// };

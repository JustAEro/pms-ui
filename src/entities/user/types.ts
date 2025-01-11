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

export type CreateUserDto = {
  first_name: string;
  is_admin: boolean;
  last_name: string;
  middle_name: string;
  password: string;
  position: string;
  username: string;
};

export type UpdateUserDto = CreateUserDto;

export type FindUserDto = Omit<CreateUserDto, 'password'> & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type FindUserInPaginationDto = {
  id: string;
  username: string;
  is_admin: boolean;
  full_name: string;
};

export type FindUsersPaginationDto = {
  page_index: number;
  page_size: number;
  total: number;
  items: FindUserInPaginationDto[];
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

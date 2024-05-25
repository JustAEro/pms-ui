import { Project } from '../project';

export type UserType = 'user' | 'admin' | null;

export type User = {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  projects: Project[];
  canCreateProjects: boolean;
  userType: UserType;
};

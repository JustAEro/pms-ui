import { Project } from '../project';

export type UserType = 'user' | 'admin' | null;

export type User = {
  login: string;
  firstName: string;
  lastName: string;
  projects: Project[];
  canCreateProjects: boolean;
};

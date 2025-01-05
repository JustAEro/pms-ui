export type Project = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
};

export type CreateProject = Omit<Project, 'id'>;

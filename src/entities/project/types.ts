export type Project = {
  id: string;
  name: string;
  description: string;
};

export type CreateProject = Omit<Project, 'id'>;

export type Project = {
  id: string;
  name: string;
  description: string;
  isArchived: boolean;
};

export type CreateProject = Omit<Project, 'id'>;

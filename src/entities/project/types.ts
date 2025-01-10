export type Project = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
};

export type CreateProject = Omit<Project, 'id'>;

export type FindProjectDto = {
  created_at: string;
  description: string;
  id: string;
  is_active: boolean;
  name: string;
  updated_at: string;
};

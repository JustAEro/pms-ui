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

export type AddProjectMemberDto = {
  is_admin_project: boolean;
  role: string;
  user_id: string;
  full_name?: string;
  username?: string;
};

export type GetProjectsDto = {
  page_index: number;
  page_size: number;
  total: number;
  items: Project[];
};

export type GetProjectMemberDto = {
  full_name: string;
  user_id: string;
  role: string;
  is_admin_project: boolean;
  username: string;
};

import { AxiosError } from 'axios';
import { createEffect } from 'effector';

import { $userId } from '@pms-ui/entities/user';
import { instance } from '@pms-ui/shared/api/http/axios';
import { sleep } from '@pms-ui/shared/lib';

import type { User } from '../user';

import { findProjectDtoToProject } from './mapping';
import {
  AddProjectMemberDto,
  CreateProject,
  FindProjectDto,
  GetProjectsDto,
  Project,
} from './types';

const projects: Project[] = [
  {
    id: '1',
    name: 'Proj1',
    description: 'desc_proj_1',
    is_active: true,
  },
  {
    id: '2',
    name: 'Proj2',
    description: 'desc_proj_2fjkkk',
    is_active: true,
  },
  {
    id: '3',
    name: 'Proj3',
    description: 'desc_proj_3',
    is_active: true,
  },
  {
    id: '4',
    name: 'Proj4',
    description: 'desc_proj_2fjkkk',
    is_active: true,
  },
  {
    id: '5',
    name: 'Proj5',
    description: 'desc_proj_3',
    is_active: true,
  },
  {
    id: '6',
    name: 'Proj6',
    description: 'desc_proj_2fjkkk',
    is_active: true,
  },
  {
    id: '7',
    name: 'Proj7',
    description: 'desc_proj_3',
    is_active: true,
  },
  {
    id: '8',
    name: 'Proj8',
    description: 'desc_proj_3',
    is_active: true,
  },
  {
    id: '9',
    name: 'Proj9',
    description: 'desc_proj_3',
    is_active: true,
  },
  {
    id: '10',
    name: 'Proj10',
    description: 'desc_proj_3',
    is_active: true,
  },
  {
    id: '11',
    name: 'Proj11',
    description: 'desc_proj_3',
    is_active: true,
  },
];

export const fetchProjectsMockFx = createEffect(
  async () =>
    new Promise<Project[]>((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 200);
    })
);

export const fetchProjectFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    try {
      const response = await instance.get(`/projects/${projectId}`);
      return response.data as Promise<Project>;
    } catch (error) {
      throw new Error('Ошибка при загрузке проекта');
    }
  }
);

export const fetchProjectsFx = createEffect(
  async ({ userId }: { userId: string }) => {
    try {
      const response = await instance.get(`/users/${userId}/projects`);
      return response.data;
    } catch (error) {
      throw new Error('Ошибка при загрузке проектов');
    }
  }
);

export const fetchProjectsApiFx = createEffect(async () => {
  try {
    const response = await instance.get<GetProjectsDto>(`/projects`);
    return response.data.items;
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      throw error.response?.data;
    }

    throw error;
  }
});

export const fetchProjectMockFx = createEffect(
  async ({ projectId }: { projectId: string }) =>
    new Promise<Project>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = projects.find((project) => project.id === projectId);

        if (foundUser) {
          resolve(foundUser);
        } else {
          reject(Error(`Project with id ${projectId} is not found`));
        }
      }, 1000);
    })
);

export const createProjectFx = createEffect(
  async (project: { name: string; description: string }) => {
    try {
      const response = await instance.post('/projects', project);
      const projectId = response.data.id;
      const userId = $userId.getState();

      if (!userId) {
        throw new Error('Пользователь не найден, невозможно добавить в проект');
      }

      await addUserToProjectFx({
        projectId,
        userId,
        data: {
          is_admin_project: true,
          role: 'Руководитель проекта',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create project');
    }
  }
);
export const createProjectMockFx = createEffect(
  async ({ name, description }: CreateProject) => {
    const newProject: Project = {
      id: String(Date.now()),
      name,
      description,
      is_active: true,
    };

    projects.push(newProject);

    return new Promise<Project>((resolve) => {
      setTimeout(() => {
        resolve(newProject);
      }, 3000);
    });
  }
);

export const fetchArchivedProjectsMockFx = createEffect(
  async () =>
    new Promise<Project[]>((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 1000);
    })
);
export const fetchArchivedProjectsFx = createEffect(
  async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
    const response = await fetch(
      `/api/v1/projects/archived?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      throw new Error('Ошибка при загрузке проектов');
    }
    return response.json();
  }
);
let usersList: User[] = [
  {
    id: '1',
    login: 'seg_fault',
    firstName: 'Segun',
    lastName: 'Adebayo',
    projects: [
      {
        id: 'id1',
        name: 'S_JIRO',
        description: 's_jiro',
        is_active: true,
      },
      {
        id: 'id2',
        name: 'DevRel',
        description: 'devRel',
        is_active: true,
      },
    ],
    canCreateProjects: false,
    userType: null,
    password: '',
    position: '',
  },
  {
    id: '2',
    login: 'mark_down',
    firstName: 'Mark',
    lastName: 'Chandler',
    projects: [
      {
        id: 'id3',
        name: 'Developer',
        description: 'dev_to',
        is_active: true,
      },
    ],
    canCreateProjects: true,
    userType: null,
    password: '',
    position: '',
  },
  {
    id: '3',
    login: 'sirgay_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
    projects: [],
    canCreateProjects: true,
    userType: null,
    password: '',
    position: '',
  },
];

let adminsList = usersList.slice(0, 2);

export const fetchMembersOfProjectMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ projectId }: { projectId: string }) =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(usersList);
      }, 2000);
    })
);

export const fetchAdminsOfProjectMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ projectId }: { projectId: string }) =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(adminsList);
      }, 1000);
    })
);

export const editProjectMockFx = createEffect(async (project: Project) => {
  const { id, name, description } = project;

  const projectToEdit = projects.find((project) => project.id === id)!;

  projectToEdit.name = name;
  projectToEdit.description = description;

  return new Promise<Project>((resolve) => {
    setTimeout(() => {
      resolve(projectToEdit);
    }, 3000);
  });
});

export const deleteMemberFromProjectMockFx = createEffect(
  async (userId: User['id']) => {
    usersList = usersList.filter((user) => user.id !== userId);
  }
);

export const addMemberToProjectMockFx = createEffect(
  async (userLogin: User['login']) => {
    const newUser: User = {
      login: userLogin,
      id: Date.now().toString(),
      firstName: userLogin,
      lastName: userLogin,
      projects: [],
      canCreateProjects: false,
      userType: null,
      password: '',
      position: '',
    };

    usersList = [...usersList, newUser];

    return newUser;
  }
);

export const archiveProjectMockFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    const projectToBeArchived = projects.find(
      (project) => project.id === projectId
    )!;

    projectToBeArchived.is_active = false;

    return projectToBeArchived;
  }
);
export const archiveProjectFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    try {
      const response = await instance.put(`/projects/${projectId}/archive`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to archive project with id ${projectId}`);
    }
  }
);
export const unarchiveProjectMockFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    const projectToBeArchived = projects.find(
      (project) => project.id === projectId
    )!;

    projectToBeArchived.is_active = true;

    return projectToBeArchived;
  }
);

export const unarchiveProjectFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    try {
      const response = await instance.put(`/projects/${projectId}/unarchive`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to archive project with id ${projectId}`);
    }
  }
);

export const updateAdminsOfProjectMockFx = createEffect(
  async (adminsIds: User['id'][]) => {
    console.log(adminsIds);
    const users = adminsIds.map(
      (adminId) => usersList.find((user) => user.id === adminId)!
    );
    console.log(users);

    adminsList = users;

    await sleep(500);

    return adminsList;
  }
);

let projectsOfUser: Project[] = [
  {
    id: '1',
    name: 'Proj1',
    description: 'desc_proj_1',
    is_active: true,
  },
  {
    id: '2',
    name: 'Proj2',
    description:
      // eslint-disable-next-line max-len
      'desc_proj_2fjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkg',
    is_active: true,
  },
  {
    id: '3',
    name: 'Proj3',
    description: 'desc_proj_3',
    is_active: true,
  },
];

export const fetchProjectsOfUserMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ userId, token }: { userId: string; token: string }) =>
    new Promise<Project[]>((resolve) => {
      setTimeout(() => {
        resolve(projectsOfUser);
      }, 1000);
    })
);

export const fetchProjectsOfUserApiFx = createEffect(
  async ({ userId }: { userId: string }) => {
    try {
      const response = await instance.get<FindProjectDto[]>(
        `/users/${userId}/projects`
      );

      return response.data;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        throw error.response?.data;
      }

      throw error;
    }
  }
);

export const fetchProjectsOfUserFx = createEffect<
  { userId: string },
  Project[]
>(async ({ userId }: { userId: string }) => {
  const dtos = await fetchProjectsOfUserApiFx({ userId });

  const projects = dtos.map((dto) => findProjectDtoToProject(dto));

  return projects;
});

export const addUserToProjectMockFx = createEffect(
  async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId,
    project,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token,
  }: {
    userId: string;
    project: Project;
    token: string;
  }) =>
    new Promise<Project>((resolve) => {
      setTimeout(() => {
        projectsOfUser = [...projectsOfUser, project];

        resolve(project);
      }, 200);
    })
);
export const addUserToProjectFx = createEffect(
  async ({
    projectId,
    userId,
    data,
  }: {
    projectId: string;
    userId: string;
    data: {
      is_admin_project: boolean;
      role: string;
    };
  }) => {
    try {
      const response = await instance.post(
        `/projects/${projectId}/members/${userId}`,
        {
          ...data,
          user_id: userId, // Добавляем `user_id` в тело запроса
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to add user to project');
    }
  }
);

export const addUserToProjectApiFx = createEffect(
  async ({
    projectId,
    userId,
    dto,
  }: {
    projectId: string;
    userId: string;
    dto: AddProjectMemberDto;
  }) => {
    try {
      await instance.post(`/projects/${projectId}/members/${userId}`, dto);

      const project = await fetchProjectFx({ projectId });

      return project;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        throw error.response?.data;
      }

      throw error;
    }
  }
);

export const deleteUserFromProjectMockFx = createEffect(
  async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId,
    projectId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token,
  }: {
    userId: string;
    projectId: Project['id'];
    token: string;
  }) =>
    new Promise<Project>((resolve, reject) => {
      setTimeout(() => {
        const projectToBeDeletedFrom = structuredClone(
          projectsOfUser.find((project) => project.id === projectId)
        );

        if (!projectToBeDeletedFrom) {
          reject(new Error('Project is not found'));
        }

        projectsOfUser = projectsOfUser.filter(
          (project) => project.id !== projectId
        );

        resolve(projectToBeDeletedFrom!);
      }, 200);
    })
);

export const deleteUserFromProjectApiFx = createEffect(
  async ({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: Project['id'];
  }) => {
    try {
      const project = await fetchProjectFx({ projectId });

      await instance.delete(`/projects/${projectId}/members/${userId}`);

      return project;
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        throw error.response?.data;
      }

      throw error;
    }
  }
);

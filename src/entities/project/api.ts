import { createEffect } from 'effector';

import { sleep } from '@pms-ui/shared/lib';

import type { User } from '../user';

import { CreateProject, Project } from './types';

const projects: Project[] = [
  {
    id: '1',
    name: 'Proj1',
    description: 'desc_proj_1',
    isArchived: false,
  },
  {
    id: '2',
    name: 'Proj2',
    description: 'desc_proj_2fjkkk',
    isArchived: false,
  },
  {
    id: '3',
    name: 'Proj3',
    description: 'desc_proj_3',
    isArchived: false,
  },
  {
    id: '4',
    name: 'Proj4',
    description: 'desc_proj_2fjkkk',
    isArchived: false,
  },
  {
    id: '5',
    name: 'Proj5',
    description: 'desc_proj_3',
    isArchived: false,
  },
  {
    id: '6',
    name: 'Proj6',
    description: 'desc_proj_2fjkkk',
    isArchived: false,
  },
  {
    id: '7',
    name: 'Proj7',
    description: 'desc_proj_3',
    isArchived: false,
  },
  {
    id: '8',
    name: 'Proj8',
    description: 'desc_proj_3',
    isArchived: false,
  },
  {
    id: '9',
    name: 'Proj9',
    description: 'desc_proj_3',
    isArchived: false,
  },
  {
    id: '10',
    name: 'Proj10',
    description: 'desc_proj_3',
    isArchived: false,
  },
  {
    id: '11',
    name: 'Proj11',
    description: 'desc_proj_3',
    isArchived: false,
  },
];

export const fetchProjectsMockFx = createEffect(
  async () =>
    new Promise<Project[]>((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 1000);
    })
);
export const fetchProjectsFx = createEffect(async () => {
  const response = await fetch(`/api/v1/projects?pageIndex=1&pageSize=10`);
  if (!response.ok) {
    throw new Error('Ошибка при загрузке проектов');
  }
  return response.json().then((res) => res.items);
});

export const fetchProjectFx = createEffect(
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
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return await response.json();
  }
);
export const createProjectMockFx = createEffect(
  async ({ name, description }: CreateProject) => {
    const newProject: Project = {
      id: String(Date.now()),
      name,
      description,
      isArchived: false,
    };

    projects.push(newProject);

    return new Promise<Project>((resolve) => {
      setTimeout(() => {
        resolve(newProject);
      }, 3000);
    });
  }
);

export const fetchArchivedProjectsFx = createEffect(
  async () =>
    new Promise<Project[]>((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 1000);
    })
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
        isArchived: false,
      },
      {
        id: 'id2',
        name: 'DevRel',
        description: 'devRel',
        isArchived: false,
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
        isArchived: false,
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

    projectToBeArchived.isArchived = true;

    return projectToBeArchived;
  }
);

export const unarchiveProjectMockFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    const projectToBeArchived = projects.find(
      (project) => project.id === projectId
    )!;

    projectToBeArchived.isArchived = false;

    return projectToBeArchived;
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

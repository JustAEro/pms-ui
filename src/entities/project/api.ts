import { createEffect } from 'effector';

import type { User } from '../user';

import { CreateProject, Project } from './types';

const projects: Project[] = [
  {
    id: '1',
    name: 'Proj1',
    description: 'desc_proj_1',
  },
  {
    id: '2',
    name: 'Proj2',
    description: 'desc_proj_2fjkkk',
  },
  {
    id: '3',
    name: 'Proj3',
    description: 'desc_proj_3',
  },
  {
    id: '4',
    name: 'Proj4',
    description: 'desc_proj_2fjkkk',
  },
  {
    id: '5',
    name: 'Proj5',
    description: 'desc_proj_3',
  },
  {
    id: '6',
    name: 'Proj6',
    description: 'desc_proj_2fjkkk',
  },
  {
    id: '7',
    name: 'Proj7',
    description: 'desc_proj_3',
  },
  {
    id: '8',
    name: 'Proj8',
    description: 'desc_proj_3',
  },
  {
    id: '9',
    name: 'Proj9',
    description: 'desc_proj_3',
  },
  {
    id: '10',
    name: 'Proj10',
    description: 'desc_proj_3',
  },
  {
    id: '11',
    name: 'Proj11',
    description: 'desc_proj_3',
  },
];

export const fetchProjectsFx = createEffect(
  async () =>
    new Promise<Project[]>((resolve) => {
      setTimeout(() => {
        resolve(projects);
      }, 1000);
    })
);

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
  async ({ name, description }: CreateProject) => {
    const newProject: Project = {
      id: String(Date.now()),
      name,
      description,
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
      },
      {
        id: 'id2',
        name: 'DevRel',
        description: 'devRel',
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

export const fetchMembersOfProjectMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ projectId }: { projectId: string }) =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => {
        resolve(usersList);
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

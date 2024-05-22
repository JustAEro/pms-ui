import { createEffect } from 'effector';

import { Project } from './types';

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

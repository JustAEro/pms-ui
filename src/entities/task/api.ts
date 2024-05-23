import { createEffect } from 'effector';

import { TaskOnBoard } from './types';

let tasks: TaskOnBoard[] = [
  {
    id: '1',
    name: 'task1',
    description: 'task1_desc',
    status: 'Отложено',
  },
  {
    id: '2',
    name: 'task2',
    description: 'task2_desc',
    status: 'В работе',
  },
  {
    id: '3',
    name: 'task3',
    description: 'task3_desc',
    status: 'Открыт',
  },
  {
    id: '4',
    name: 'task4',
    description: 'task4_desc',
    status: 'На тестировании',
  },
  {
    id: '5',
    name: 'task5',
    description: 'task5_desc',
    status: 'На ревью',
  },
];

export const fetchTasksInProjectFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ projectId }: { projectId: string }) =>
    new Promise<TaskOnBoard[]>((resolve) => {
      setTimeout(() => {
        resolve(tasks);
      }, 1000);
    })
);

export const updateTaskFx = createEffect(
  async (taskToUpdate: TaskOnBoard) =>
    new Promise<TaskOnBoard>((resolve) => {
      setTimeout(() => {
        tasks = [
          taskToUpdate,
          ...tasks.filter((task) => task.id !== taskToUpdate.id),
        ];

        resolve(taskToUpdate);
      }, 200);
    })
);

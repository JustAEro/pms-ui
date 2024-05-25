import { addDays, subDays } from 'date-fns';
import { createEffect } from 'effector';

import { Task } from './types';

const currentDate = new Date();

let tasks: Task[] = [
  {
    id: '1',
    name: 'task1',
    description: 'task1_desc',
    status: 'Отложено',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
  },
  {
    id: '2',
    name: 'task2',
    description: 'task2_desc',
    status: 'В работе',
    creationDate: currentDate,
    deadlineDate: subDays(currentDate, 1),
  },
  {
    id: '3',
    name: 'task3',
    description: 'task3_desc',
    status: 'Открыт',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
  },
  {
    id: '4',
    name: 'Заголовок задачи 4',
    description:
      // eslint-disable-next-line max-len
      'Описание задачи 1 Описание задачи 1 Описание задачи 1 Описание задачи 1 Описание задачи 1 Описание задачи 1 Описание задачи 1Описание задачи 1Описание задачи 1Описание задачи 1Описание задачи 1Описание задачи 1Описание задачи 1Описание задачи 1Описание задачи 1 БимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБумБимБамБум',
    status: 'На тестировании',
    creationDate: currentDate,
    deadlineDate: subDays(currentDate, 1),
  },
  {
    id: '5',
    name: 'task5',
    description: 'task5_desc',
    status: 'На ревью',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
  },
  {
    id: '6',
    name: 'task6',
    description: 'task6_desc',
    status: 'Архив',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
  },
  {
    id: '7',
    name: 'task7',
    description: 'task7_desc',
    status: 'Закрыт',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
  },
];

export const fetchTasksInProjectFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ projectId }: { projectId: string }) =>
    new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        resolve(tasks);
      }, 1000);
    })
);

export const fetchTaskFx = createEffect(
  async ({ taskId }: { taskId: string }) =>
    new Promise<Task>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = tasks.find((task) => task.id === taskId);

        if (foundUser) {
          resolve(foundUser);
        } else {
          reject(new Error(`Task with id ${taskId} is not found`));
        }
      }, 1000);
    })
);

export const updateTaskFx = createEffect(
  async (taskToUpdate: Task) =>
    new Promise<Task>((resolve) => {
      setTimeout(() => {
        tasks = [
          taskToUpdate,
          ...tasks.filter((task) => task.id !== taskToUpdate.id),
        ];

        resolve(taskToUpdate);
      }, 1000);
    })
);

import { addDays, subDays } from 'date-fns';
import { createEffect } from 'effector';

import { User } from '../user';

import { Task } from './types';

const usersList: User[] = [
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
    login: 'sir_lazar',
    firstName: 'Lazar',
    lastName: 'Nikolov',
    projects: [],
    canCreateProjects: true,
    userType: null,
    password: '',
    position: '',
  },
];

const currentDate = new Date();

let tasks: Task[] = [
  {
    id: '1',
    name: 'task1',
    description: 'task1_desc',
    status: 'Отложено',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
  },
  {
    id: '2',
    name: 'task2',
    description: 'task2_desc',
    status: 'В работе',
    creationDate: currentDate,
    deadlineDate: subDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
  },
  {
    id: '3',
    name: 'task3',
    description: 'task3_desc',
    status: 'Открыт',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
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
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
  },
  {
    id: '5',
    name: 'task5',
    description: 'task5_desc',
    status: 'На ревью',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
  },
  {
    id: '6',
    name: 'task6',
    description: 'task6_desc',
    status: 'Архив',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
  },
  {
    id: '7',
    name: 'task7',
    description: 'task7_desc',
    status: 'Закрыт',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
  },
];

export const fetchTasksInProjectMockFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ projectId }: { projectId: string }) =>
    new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        resolve(tasks);
      }, 1000);
    })
);

export const fetchTasksInProjectFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    const response = await fetch(`/api/v1/projects/${projectId}/tasks`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks for project with id ${projectId}`);
    }

    const data = await response.json().then((res) => res.items);
    if (!Array.isArray(data)) {
      throw new Error('API did not return an array of tasks');
    }
    return data as Task[];
  }
);

export const fetchTaskFx = createEffect(
  async ({ taskId }: { taskId: string }) =>
    new Promise<Task>((resolve, reject) => {
      setTimeout(() => {
        const foundTask = tasks.find((task) => task.id === taskId);

        if (foundTask) {
          resolve(foundTask);
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

export const generateTaskPlanByAIFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ taskId, taskName }: { taskId: string; taskName: string }) =>
    new Promise<string>((resolve) => {
      setTimeout(() => {
        const universalTaskPlan =
          // eslint-disable-next-line max-len
          '1. Определение цели.\n2. Анализ задачи.\n3. Сбор информации и ресурсов.\n4. Планирование.\n5. Оценка рисков.\n6. Действия.\n7. Контроль и корректировка.\n8. Завершение.\n9. Ретроспектива.';

        resolve(universalTaskPlan);
      }, 1000);
    })
);

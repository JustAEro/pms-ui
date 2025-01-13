import { addDays, subDays } from 'date-fns';
import { createEffect } from 'effector';

import { fetchUserFullInfoFx } from '@pms-ui/entities/user';
import { instance } from '@pms-ui/shared/api/http/axios';
import { convertToUTC } from '@pms-ui/shared/lib';

import { User } from '../user';

import { mapTaskDtoToTask, mapTaskToCreateTaskDto } from './mapping';
import {
  CreateTask,
  CreateTaskDto,
  Task,
  TaskDto,
  UpdateTask,
  UpdateTaskDto,
} from './types';

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
    project_id: '1',
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
    project_id: '2',
  },
  {
    id: '3',
    name: 'task3',
    description: 'task3_desc',
    status: 'Открыта',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
    project_id: '3',
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
    project_id: '1',
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
    project_id: '2',
  },
  {
    id: '6',
    name: 'task6',
    description: 'task6_desc',
    status: 'Завершена',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
    project_id: '3',
  },
  {
    id: '7',
    name: 'task7',
    description: 'task7_desc',
    status: 'Завершена',
    creationDate: currentDate,
    deadlineDate: addDays(currentDate, 1),
    userAuthor: usersList[0]!,
    userExecutor: usersList[1]!,
    userTester: usersList[2]!,
    project_id: '4',
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
    try {
      const response = await instance.get<TaskDto[]>(
        `/projects/${projectId}/tasks`
      );
      const taskDataArray = response.data;

      const tasks = await Promise.all(
        taskDataArray.map(async (taskData) => {
          // Параллельные запросы для каждого пользователя
          const [userAuthor, userExecutor, userTester] = await Promise.all([
            fetchUserFullInfoFx({ userId: taskData.author_id }),
            fetchUserFullInfoFx({ userId: taskData.executor_id }),
            fetchUserFullInfoFx({ userId: taskData.tester_id }),
          ]);

          // Применяем mapTaskDtoToTask к каждому элементу массива
          return mapTaskDtoToTask(
            taskData,
            userAuthor,
            userExecutor,
            userTester
          );
        })
      );

      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks for project with id ${projectId}`);
    }
  }
);

export const fetchTaskFx = createEffect(
  async ({ taskId }: { taskId: string }): Promise<Task> => {
    try {
      // Запрос на получение задачи
      const response = await instance.get<TaskDto>(`/task/${taskId}`);
      const taskData = response.data;

      // Параллельное выполнение запросов для получения пользователей
      const [userAuthor, userExecutor, userTester] = await Promise.all([
        fetchUserFullInfoFx({ userId: taskData.author_id }),
        fetchUserFullInfoFx({ userId: taskData.executor_id }),
        fetchUserFullInfoFx({ userId: taskData.tester_id }),
      ]);

      // Использование функции для преобразования данных задачи
      const data = mapTaskDtoToTask(
        taskData,
        userAuthor,
        userExecutor,
        userTester
      );
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch task for project with id ${taskId}`);
    }
  }
);

export const updateTaskFx = createEffect(async (taskToUpdate: Task) => {
  try {
    const taskId = taskToUpdate.id;
    await instance.put(`/task/${taskId}`, mapTaskToCreateTaskDto(taskToUpdate));
    const updatedTask = await fetchTaskFx({ taskId });
    return updatedTask;
  } catch (error) {
    throw new Error(`Failed to update task`);
  }
});

export const updateTaskDtoFx = createEffect(
  async ({ dto, taskId }: { dto: UpdateTaskDto; taskId: string }) => {
    try {
      await instance.put(`/task/${taskId}`, dto);

      const updatedTask = await fetchTaskFx({ taskId });
      return updatedTask;
    } catch (error) {
      throw new Error(`Failed to update task`);
    }
  }
);

/* export const generateTaskPlanByAIFx = createEffect(
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
); */

export const generateTaskPlanByAIFx = createEffect(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async ({ taskId, taskName }: { taskId: string; taskName: string }) => {
    const requestBody = {
      request: `${taskName}`,
    };

    try {
      const response = await fetch('/api/v1/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task plan from AI');
      }

      const data = await response.json();
      return data.response; // Assuming the response has a 'response' field
    } catch (error) {
      throw new Error('Error generating task plan: ');
    }
  }
);

export const createTaskFx = createEffect(
  async ({ createTask }: { createTask: CreateTaskDto }) => {
    try {
      const response = await instance.post('/task', {
        ...createTask,
        deadline: convertToUTC(createTask.deadline),
      });

      return response.data;
    } catch (error) {
      // Обработка ошибки
      throw new Error('Ошибка при создании задачи');
    }
  }
);
export const createTaskMockFx = createEffect(
  async ({
    createTask,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token,
    currentUser,
  }: {
    createTask: CreateTask;
    token: string;
    currentUser: User;
  }) => {
    const { userExecutorId, userTesterId } = createTask;

    const author = currentUser;

    const executor = usersList.find((user) => user.id === userExecutorId);

    if (!executor) {
      throw new Error('Executor id not found');
    }

    const tester = usersList.find((user) => user.id === userTesterId);

    if (!tester) {
      throw new Error('Tester id not found');
    }

    if (new Date(createTask.deadlineDate).toString() === 'Invalid Date') {
      throw new Error('Deadline date is not provided');
    }

    const task: Task = {
      id: String(Date.now()),
      name: createTask.name,
      description: createTask.description,
      status: 'Открыта',
      creationDate: currentDate,
      deadlineDate: new Date(createTask.deadlineDate),
      userAuthor: author,
      userExecutor: executor,
      userTester: tester,
      project_id: createTask.project_id,
    };

    tasks = [...tasks, task];

    return structuredClone(task);
  }
);

export const updateTaskMockFx = createEffect(
  async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    updateTask,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token,
    currentUser,
  }: {
    id: string;
    updateTask: UpdateTask;
    token: string;
    currentUser: User;
  }) => {
    const { userExecutorId, userTesterId } = updateTask;

    const author = currentUser;

    const executor = usersList.find((user) => user.id === userExecutorId);

    if (!executor) {
      throw new Error('Executor id not found');
    }

    const tester = usersList.find((user) => user.id === userTesterId);

    if (!tester) {
      throw new Error('Tester id not found');
    }

    if (new Date(updateTask.deadlineDate).toString() === 'Invalid Date') {
      throw new Error('Deadline date is not provided');
    }

    const taskToUpdate: Task = {
      id,
      name: updateTask.name,
      description: updateTask.description,
      status: updateTask.status,
      creationDate: currentDate,
      deadlineDate: new Date(updateTask.deadlineDate),
      userAuthor: author,
      userExecutor: executor,
      userTester: tester,
      project_id: updateTask.project_id,
    };

    tasks = [
      taskToUpdate,
      ...tasks.filter((task) => task.id !== taskToUpdate.id),
    ];

    return structuredClone(taskToUpdate);
  }
);

export const fetchClosedTasksFx = createEffect(
  async ({ projectId }: { projectId: string }) => {
    try {
      const response = await instance.get<TaskDto[]>(
        `/projects/${projectId}/tasks`
      );
      const taskDataArray = response.data.filter(
        (task) => task.status === 'Завершена'
      );

      const tasks = await Promise.all(
        taskDataArray.map(async (taskData) => {
          // Параллельные запросы для каждого пользователя
          const [userAuthor, userExecutor, userTester] = await Promise.all([
            fetchUserFullInfoFx({ userId: taskData.author_id }),
            fetchUserFullInfoFx({ userId: taskData.executor_id }),
            fetchUserFullInfoFx({ userId: taskData.tester_id }),
          ]);

          // Применяем mapTaskDtoToTask к каждому элементу массива
          return mapTaskDtoToTask(
            taskData,
            userAuthor,
            userExecutor,
            userTester
          );
        })
      );

      return tasks;
    } catch (error) {
      throw new Error(`Failed to fetch tasks for project with id ${projectId}`);
    }
  }
);

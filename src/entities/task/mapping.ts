import { convertDateToUTC } from '@pms-ui/shared/lib';

import { User } from '../user';

import { CreateTaskDto, Task, TaskDto, TaskStatus } from './types';

export const mapTaskDtoToTask = (
  taskDto: TaskDto,
  userAuthor: User,
  userExecutor: User,
  userTester: User
): Task => {
  const task: Task = {
    id: taskDto.id,
    name: taskDto.name,
    description: taskDto.description,
    status: taskDto.status as TaskStatus,
    creationDate: new Date(taskDto.created_at),
    deadlineDate: new Date(taskDto.deadline),
    userAuthor,
    userExecutor,
    userTester,
    project_id: taskDto.project_id,
  };

  return task;
};

export const mapTaskToCreateTaskDto = (task: Task): CreateTaskDto => ({
  author_id: task.userAuthor.id, // Используем ID автора задачи
  deadline: convertDateToUTC(task.deadlineDate), // Преобразуем дату в строку ISO
  description: task.description,
  executor_id: task.userExecutor.id, // Используем ID исполнителя задачи
  name: task.name,
  project_id: task.project_id,
  status: task.status,
  tester_id: task.userTester.id, // Используем ID тестера задачи
});

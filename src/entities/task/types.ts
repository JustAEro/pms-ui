import { User, FindUserDto } from '../user';

import { taskStatuses, taskStatusesNotShownOnBoard } from './constants';

export type Task = {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  creationDate: Date;
  deadlineDate: Date;
  userAuthor: User;
  userExecutor: User;
  userTester: User;
  project_id: string;
};
export type TaskDto = {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  project_id: string;
  author_id: string;
  executor_id: string;
  tester_id: string;
  created_at: string;
  deadline: string;
};

export type CreateTask = {
  name: string;
  description: string;
  userExecutorId: User['id'];
  userTesterId: User['id'];
  deadlineDate: string;
  project_id: string;
};

export type CreateTaskDto = {
  author_id: string;
  deadline: string;
  description: string;
  executor_id: string;
  name: string;
  project_id: string;
  status: TaskStatus;
  tester_id: string;
};

export type UpdateTask = CreateTask & {
  status: TaskStatus;
};

export type UpdateTaskDto = CreateTaskDto;

export type TaskStatus = typeof taskStatuses[number];

export type TaskOnBoard = Task & {
  status: DisplayedOnBoardTaskStatus;
};

export type NotShownOnBoardStatuses =
  typeof taskStatusesNotShownOnBoard[number];

export type DisplayedOnBoardTaskStatus = Exclude<
  TaskStatus,
  NotShownOnBoardStatuses
>;

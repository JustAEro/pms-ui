import { User } from '../user';

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
};

export type CreateTask = {
  name: string;
  description: string;
  userExecutorId: User['id'];
  userTesterId: User['id'];
  deadlineDate: string;
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

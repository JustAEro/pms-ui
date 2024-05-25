import { taskStatuses, taskStatusesNotShownOnBoard } from './constants';

export type Task = {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  creationDate: Date;
  deadlineDate: Date;
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

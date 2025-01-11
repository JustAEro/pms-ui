import { Task, TaskDto, TaskStatus } from './types';
import { User } from '../user';
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
    deadlineDate: new Date(taskDto.deadline.replace('Z', '')),
    userAuthor,
    userExecutor,
    userTester,
    project_id: taskDto.project_id,
  };

  return task;
};

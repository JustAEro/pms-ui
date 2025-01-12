import { Task, TaskDto, TaskStatus, CreateTaskDto } from './types';
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

export const mapTaskToCreateTaskDto = (task: Task): CreateTaskDto => {
  return {
    author_id: task.userAuthor.id, // Используем ID автора задачи
    deadline: task.deadlineDate.toISOString(), // Преобразуем дату в строку ISO
    description: task.description,
    executor_id: task.userExecutor.id, // Используем ID исполнителя задачи
    name: task.name,
    project_id: task.project_id,
    status: task.status,
    tester_id: task.userTester.id, // Используем ID тестера задачи
  };
};

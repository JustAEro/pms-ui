import { User, UserDto } from './types';

export const mapUserDtoToUser = (userDto: UserDto): User => {
  const user: User = {
    id: userDto.userId ?? '',
    login: userDto.login,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
    projects: [],
    canCreateProjects: !userDto.isAdmin,
    userType: userDto.isAdmin ? 'admin' : 'user',
    password: userDto.password,
    position: userDto.position,
  };

  return user;
};

export const mapUserToUserDto = (user: User): UserDto => {
  const userDto: UserDto = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    position:
      user.userType === 'admin'
        ? 'Администратор системы'
        : 'Пользователь системы',
    isAdmin: user.userType === 'admin',
    login: user.login,
    password: user.password,
  };

  return userDto;
};

// Преобразование данных с сервера в формат User
export const mapUserServerToUser = (data: any): User => {
  return {
    id: data.id,
    login: data.username, // Преобразуем поле "username" в "login"
    firstName: data.first_name,
    lastName: data.last_name || '', // Если last_name пустое, ставим пустую строку
    projects: [], // Здесь можно добавить логику для получения проектов, если нужно
    canCreateProjects: data.is_admin, // Преобразуем "is_admin" в "canCreateProjects"
    userType: data.is_admin ? 'admin' : 'user', // Преобразуем "is_admin" в "userType"
    password: '', // Пароль не передается в ответе, его нужно будет получить другим способом
    position: data.position,
  };
};

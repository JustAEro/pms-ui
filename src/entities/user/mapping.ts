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

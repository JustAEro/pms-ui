import { Route, RouterProvider } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { $userType, UserType } from '@pms-ui/entities/user';
import { AdminsPanelPage } from '@pms-ui/pages/admin-panel';
import { ArchiveProjectsPage } from '@pms-ui/pages/archive-projects-page';
import { CreateEditTaskPage } from '@pms-ui/pages/create-edit-task-page';
import { HomePage } from '@pms-ui/pages/home';
import { ProfilePage } from '@pms-ui/pages/profile';
import { ProjectManagementPage } from '@pms-ui/pages/project-management-page';
import { ProjectPage } from '@pms-ui/pages/project-page';
import { ProjectsPage } from '@pms-ui/pages/projects-page';
import { TaskPage } from '@pms-ui/pages/task-page';
import { UserEditPage } from '@pms-ui/pages/user-edit-page';
import { UsersAdminPanelPage } from '@pms-ui/pages/users-admin-panel';
import { router, routes } from '@pms-ui/shared/routes';
import { theme } from '@pms-ui/shared/ui';

import { appMounted } from './model';

export const App: FC = () => {
  const onAppMount = useUnit(appMounted);
  const userType = useUnit($userType);

  useEffect(() => {
    onAppMount();
  }, [onAppMount]);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router}>
        <Route route={routes.homeRoute} view={homePageView(userType)} />
        <Route
          route={routes.usersAdminPanelRoute}
          view={adminsPageView(UsersAdminPanelPage, userType)}
        />
        <Route
          route={routes.adminsPanelRoute}
          view={adminsPageView(AdminsPanelPage, userType)}
        />
        <Route route={routes.profileRoute} view={profilePageView(userType)} />
        <Route
          route={routes.userEditRoute}
          view={adminsPageView(UserEditPage, userType)}
        />
        <Route
          route={routes.projectsRoute}
          view={usersPageView(ProjectsPage, userType)}
        />
        <Route
          route={routes.archivedProjectsRoute}
          view={usersPageView(ArchiveProjectsPage, userType)}
        />
        <Route
          route={routes.projectRoute}
          view={usersPageView(ProjectPage, userType)}
        />
        <Route
          route={routes.taskRoute}
          view={usersPageView(TaskPage, userType)}
        />
        <Route
          route={routes.projectManagementRoute}
          view={usersPageView(ProjectManagementPage, userType)}
        />
        <Route
          route={routes.createTaskRoute}
          view={usersPageView(CreateEditTaskPage, userType)}
        />
        <Route
          route={routes.editTaskRoute}
          view={usersPageView(CreateEditTaskPage, userType)}
        />
      </RouterProvider>
    </ChakraProvider>
  );
};

const homePageView = (userType: UserType) => {
  switch (userType) {
    case 'admin':
      return UsersAdminPanelPage;
    case 'user':
      return ProjectsPage;
    default:
      return HomePage;
  }
};

const adminsPageView = (Page: FC, userType: UserType) => {
  switch (userType) {
    case 'admin':
      return Page;
    case 'user':
      return homePageView('user');
    default:
      return homePageView(null);
  }
};

const usersPageView = (Page: FC, userType: UserType) => {
  switch (userType) {
    case 'user':
      return Page;
    case 'admin':
      return homePageView('admin');
    default:
      return homePageView(null);
  }
};

const profilePageView = (userType: UserType) => {
  if (userType === null) {
    return homePageView(null);
  }

  return ProfilePage;
};

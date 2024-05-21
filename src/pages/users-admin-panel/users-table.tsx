import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FC } from 'react';

import {
  Checkbox,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { routes } from '@pms-ui/shared/routes';
import { PencilIcon } from '@pms-ui/shared/ui';

import { $isUsersListLoading, $usersList } from './model';

export const UsersTable: FC = () => {
  const usersList = useUnit($usersList);
  const isUsersListLoading = useUnit($isUsersListLoading);

  if (isUsersListLoading) {
    return <Spinner marginTop="30px" />;
  }

  return (
    <TableContainer
      border="1px solid"
      borderColor="#E2E8F0"
      borderRadius="6px"
      marginTop="30px"
    >
      <Table size="sm" variant="striped">
        <Thead height="40px">
          <Tr>
            <Th>Имя пользователя</Th>
            <Th>Логин</Th>
            <Th>Проекты</Th>
            <Th>Редактирование пользователя</Th>
            <Th>Может создавать проекты</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usersList.map((user) => (
            <Tr key={user.id} height="40px">
              <Td>{`${user.firstName} ${user.lastName}`}</Td>
              <Td>{`${user.login}`}</Td>
              <Td>{user.projects.map((project) => project.name).join(', ')}</Td>
              <Td>
                <Flex alignItems="center" justifyContent="center">
                  <Link to={routes.userEditRoute} params={{ userId: user.id }}>
                    <PencilIcon />
                  </Link>
                </Flex>
              </Td>
              <Td>
                <Flex alignItems="center" justifyContent="center">
                  <Checkbox
                    isChecked={user.canCreateProjects}
                    border="1px solid"
                    borderColor="#E2E8F0"
                    borderRadius="6px"
                    bgColor="#FFFFFF"
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

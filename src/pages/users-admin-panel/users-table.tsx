import { FC } from 'react';

import {
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { User } from '@pms-ui/entities/user';
import { PencilIcon } from '@pms-ui/shared/ui';

export const UsersTable: FC = () => {
  const usersList: User[] = [
    {
      login: 'seg_fault',
      firstName: 'Segun',
      lastName: 'Adebayo',
      projects: [
        {
          id: 'id1',
          name: 'S_JIRO',
          description: 's_jiro',
        },
        {
          id: 'id2',
          name: 'DevRel',
          description: 'devRel',
        },
      ],
      canCreateProjects: false,
    },
    {
      login: 'mark_down',
      firstName: 'Mark',
      lastName: 'Chandler',
      projects: [
        {
          id: 'id3',
          name: 'Developer',
          description: 'dev_to',
        },
      ],
      canCreateProjects: true,
    },
    {
      login: 'sirgay_lazar',
      firstName: 'Lazar',
      lastName: 'Nikolov',
      projects: [],
      canCreateProjects: true,
    },
  ];
  return (
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
          <Tr key={user.login} height="40px">
            <Td>{`${user.firstName} ${user.lastName}`}</Td>
            <Td>{`${user.login}`}</Td>
            <Td>{user.projects.map((project) => project.name).join(', ')}</Td>
            <Td>
              <Flex alignItems="center" justifyContent="center">
                <div>
                  <PencilIcon />
                </div>
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
  );
};

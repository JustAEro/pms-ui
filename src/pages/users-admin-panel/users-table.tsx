import { Link } from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { FC } from 'react';
import ReactPaginate from 'react-paginate';

import {
  Box,
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

import {
  $currentPageNumber,
  $isUsersListLoading,
  $pagesCount,
  pageNumberChanged,
  usersPagination,
} from './model';

import './users-table.module.scss';

export const UsersTable: FC = () => {
  const usersListInPage = useUnit(usersPagination.$currentItems);
  const pagesCount = useUnit($pagesCount);
  const currentPageNumber = useUnit($currentPageNumber);
  const onPageNumberChange = useUnit(pageNumberChanged);
  // const usersList = useUnit($usersList);
  const isUsersListLoading = useUnit($isUsersListLoading);

  if (isUsersListLoading) {
    return <Spinner marginTop="30px" />;
  }

  return (
    <>
      {/* <TableContainer
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
                <Td>
                  {user.projects.map((project) => project.name).join(', ')}
                </Td>
                <Td>
                  <Flex alignItems="center" justifyContent="center">
                    <Link
                      to={routes.userEditRoute}
                      params={{ userId: user.id }}
                    >
                      <PencilIcon />
                    </Link>
                  </Flex>
                </Td>
                <Td>
                  <Flex alignItems="center" justifyContent="center">
                    <Checkbox
                      isChecked={
                        usersAllowedToCreateProjectsCheckboxesState[user.id]
                      }
                      onChange={() => {
                        const newStatus =
                          !usersAllowedToCreateProjectsCheckboxesState[user.id];

                        onAllowToCreateProjectsCheckboxClick({
                          id: user.id,
                          newStatus,
                        });
                      }}
                      disabled={isDisabledCheckboxToChangeAllowToCreateProjects}
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

      <Box>With pagination</Box> */}

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
            </Tr>
          </Thead>
          <Tbody>
            {usersListInPage.map((user) => (
              <Tr key={user.id} height="40px">
                <Td>{`${user.firstName} ${user.lastName}`}</Td>
                <Td>{`${user.login}`}</Td>
                <Td>
                  {user.projects.map((project) => project.name).join(', ')}
                </Td>
                <Td>
                  <Flex alignItems="center" justifyContent="center">
                    <Link
                      to={routes.userEditRoute}
                      params={{ userId: user.id }}
                    >
                      <PencilIcon />
                    </Link>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Box height="20px" />

      <ReactPaginate
        pageCount={pagesCount}
        forcePage={currentPageNumber}
        onPageChange={({ selected }) => {
          console.log(selected);
          onPageNumberChange(selected);
        }}
        onPageActive={(selectedItem) => {
          console.log(selectedItem);
        }}
        nextLabel=">"
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination pagination-sm"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
};

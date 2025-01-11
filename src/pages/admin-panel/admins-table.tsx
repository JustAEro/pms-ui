import { FC } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import {
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Admin } from '@pms-ui/entities/admin';
import { PencilIcon } from '@pms-ui/shared/ui';

type AdminsTableProps = {
  adminsList: Admin[];
  isAdminsListLoading: boolean;
  onDeleteAdminClick: (payload: string) => string;
  onEditAdminButtonClick: (payload: { adminId: string }) => {
    adminId: string;
  };
};

export const AdminsTable: FC<AdminsTableProps> = ({
  adminsList,
  isAdminsListLoading,
  onDeleteAdminClick,
  onEditAdminButtonClick,
}: AdminsTableProps) => (
  <>
    {isAdminsListLoading && <Spinner />}
    {!isAdminsListLoading && (
      <Table size="sm" variant="striped">
        <Thead height="40px">
          <Tr>
            <Th>Имя администратора</Th>
            <Th>Логин</Th>
            <Th>Редактирование администратора</Th>
            <Th>Удаление администратора</Th>
          </Tr>
        </Thead>
        <Tbody>
          {adminsList.map((admin) => (
            <Tr key={admin.login} height="40px">
              <Td>{`${admin.firstName} ${admin.lastName}`}</Td>
              <Td>{`${admin.login}`}</Td>
              <Td>
                <Flex alignItems="center" justifyContent="center">
                  <div>
                    <PencilIcon
                      onClick={() => {
                        onEditAdminButtonClick({ adminId: admin.id });
                      }}
                    />
                  </div>
                </Flex>
              </Td>
              <Td>
                <Flex alignItems="center" justifyContent="center">
                  <CloseIcon
                    cursor="pointer"
                    onClick={() => {
                      onDeleteAdminClick(admin.id);
                    }}
                  />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )}
  </>
);

import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import { AdminsTable } from './admins-table';
import {
  $addAdminModalIsOpened,
  $adminLoginToBeDeleted,
  $deleteAdminModalIsOpened,
  $firstName,
  $isAddAdminButtonDisabled,
  $lastName,
  $login,
  $password,
  addAdminButtonClicked,
  closeAddAdminModal,
  closeDeleteAdminModal,
  deleteAdminButtonClicked,
  firstNameEdited,
  headerModel,
  lastNameEdited,
  loginEdited,
  openAddAdminModal,
  openDeleteAdminModal,
  pageMounted,
  passwordEdited,
} from './model';

const textFontSizes = [16, 21, 30];

export const AdminsPanelPage: FC = () => {
  const onPageMount = useUnit(pageMounted);

  const addAdminModalIsOpened = useUnit($addAdminModalIsOpened);
  const onOpenAddAdminModal = useUnit(openAddAdminModal);
  const onCloseAddAdminModal = useUnit(closeAddAdminModal);

  const login = useUnit($login);
  const password = useUnit($password);
  const firstName = useUnit($firstName);
  const lastName = useUnit($lastName);

  const isAddAdminButtonDisabled = useUnit($isAddAdminButtonDisabled);
  const onChangeLogin = useUnit(loginEdited);
  const onChangePassword = useUnit(passwordEdited);
  const onChangeFirstName = useUnit(firstNameEdited);
  const onChangeLastName = useUnit(lastNameEdited);

  const onAddAdminButtonClick = useUnit(addAdminButtonClicked);

  const deleteAdminModalIsOpened = useUnit($deleteAdminModalIsOpened);
  const adminLoginToBeDeleted = useUnit($adminLoginToBeDeleted);
  const onOpenDeleteAdminModal = useUnit(openDeleteAdminModal);
  const onCloseDeleteAdminModal = useUnit(closeDeleteAdminModal);

  const onDeleteAdminButtonClick = useUnit(deleteAdminButtonClicked);

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        <Text marginTop="30px" fontWeight="bold" fontSize={textFontSizes}>
          Управление администраторами системы
        </Text>
        <TableContainer
          border="1px solid"
          borderColor="#E2E8F0"
          borderRadius="6px"
          marginTop="30px"
        >
          <AdminsTable onDeleteAdminClick={onOpenDeleteAdminModal} />
        </TableContainer>
        <Button
          onClick={onOpenAddAdminModal}
          marginTop="20px"
          border="1px solid"
          borderColor="#3182CE"
          color="#3182CE"
          bgColor="#FFFFFF"
        >
          + Добавить администратора в систему
        </Button>
        <Modal
          size="xl"
          isOpen={addAdminModalIsOpened}
          onClose={onCloseAddAdminModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Flex
                marginTop="10px"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontWeight="bold" fontSize={textFontSizes}>
                  Добавление администратора
                </Text>
              </Flex>
            </ModalHeader>
            <ModalBody>
              <Spacer height="20px" />
              <Flex alignItems="center" justifyContent="center">
                <Input
                  value={login}
                  onChange={(e) => onChangeLogin(e.target.value)}
                  width="80%"
                  variant="filled"
                  placeholder="Логин"
                />
              </Flex>
              <Spacer height="20px" />
              <Flex alignItems="center" justifyContent="center">
                <Input
                  value={firstName}
                  onChange={(e) => onChangeFirstName(e.target.value)}
                  width="80%"
                  variant="filled"
                  placeholder="Имя"
                />
              </Flex>
              <Spacer height="20px" />
              <Flex alignItems="center" justifyContent="center">
                <Input
                  value={lastName}
                  onChange={(e) => onChangeLastName(e.target.value)}
                  width="80%"
                  variant="filled"
                  placeholder="Фамилия"
                />
              </Flex>
              <Spacer height="20px" />
              <Flex alignItems="center" justifyContent="center">
                <Input
                  value={password}
                  onChange={(e) => onChangePassword(e.target.value)}
                  type="password"
                  width="80%"
                  variant="filled"
                  placeholder="Пароль"
                />
              </Flex>
              <Spacer height="50px" />
              <Flex alignItems="center" justifyContent="center">
                <Button
                  onClick={onAddAdminButtonClick}
                  disabled={isAddAdminButtonDisabled}
                  width="80%"
                  variant="solid"
                  colorScheme="teal"
                >
                  Добавить
                </Button>
              </Flex>
              <Spacer height="20px" />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal
          size="xl"
          isOpen={deleteAdminModalIsOpened}
          onClose={onCloseDeleteAdminModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Flex
                marginTop="10px"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontWeight="bold" fontSize={textFontSizes}>
                  Удаление администратора
                </Text>
              </Flex>
            </ModalHeader>
            <ModalBody>
              <Spacer height="20px" />
              <Flex alignItems="center" justifyContent="center">
                <Text width="80%" textAlign="justify">
                  {`Вы действительно хотите удалить администратора
                     ${adminLoginToBeDeleted}? Данное действие необратимо`}
                </Text>
              </Flex>
              <Spacer height="50px" />
              <Flex alignItems="center" justifyContent="center">
                <Button
                  onClick={onCloseDeleteAdminModal}
                  width="80%"
                  variant="solid"
                  colorScheme="blue"
                >
                  Отмена
                </Button>
              </Flex>
              <Spacer height="25px" />
              <Flex alignItems="center" justifyContent="center">
                <Button
                  onClick={onDeleteAdminButtonClick}
                  width="80%"
                  variant="solid"
                  colorScheme="red"
                >
                  Удалить
                </Button>
              </Flex>
              <Spacer height="20px" />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
};

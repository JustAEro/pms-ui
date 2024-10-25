import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
import { useBoolean } from 'usehooks-ts';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $addUserModalIsOpened,
  $firstName,
  $isAddUserButtonDisabled,
  $isUsersListLoading,
  $lastName,
  $login,
  $password,
  addUserButtonClicked,
  closeModal,
  firstNameEdited,
  headerModel,
  lastNameEdited,
  loginEdited,
  openModal,
  pageMounted,
  passwordEdited,
} from './model';
import { UsersTable } from './users-table';

const textFontSizes = [16, 21, 30];

export const UsersAdminPanelPage: FC = () => {
  const addUserModalIsOpened = useUnit($addUserModalIsOpened);
  const onOpenModal = useUnit(openModal);
  const onCloseModal = useUnit(closeModal);
  const onPageMount = useUnit(pageMounted);

  const login = useUnit($login);
  const password = useUnit($password);
  const firstName = useUnit($firstName);
  const lastName = useUnit($lastName);

  const isAddUserButtonDisabled = useUnit($isAddUserButtonDisabled);
  const onChangeLogin = useUnit(loginEdited);
  const onChangePassword = useUnit(passwordEdited);
  const onChangeFirstName = useUnit(firstNameEdited);
  const onChangeLastName = useUnit(lastNameEdited);

  const onAddUserButtonClick = useUnit(addUserButtonClicked);

  const isUsersListLoading = useUnit($isUsersListLoading);

  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);

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
          Управление правами пользователей системы
        </Text>
        <UsersTable />
        {!isUsersListLoading && (
          <Button
            onClick={onOpenModal}
            marginTop="20px"
            border="1px solid"
            borderColor="#3182CE"
            color="#3182CE"
            bgColor="#FFFFFF"
          >
            + Добавить пользователя в систему
          </Button>
        )}
        <Modal size="xl" isOpen={addUserModalIsOpened} onClose={onCloseModal}>
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
                  Добавление пользователя
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
                <InputGroup width="80%">
                  <Input
                    value={password}
                    onChange={(e) => onChangePassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    variant="filled"
                    placeholder="Пароль"
                  />
                  <InputRightElement>
                    <Button
                      marginRight={2}
                      h="1.75rem"
                      size="sm"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Flex>
              <Spacer height="50px" />
              <Flex alignItems="center" justifyContent="center">
                <Button
                  onClick={onAddUserButtonClick}
                  disabled={isAddUserButtonDisabled}
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
      </Flex>
    </Box>
  );
};

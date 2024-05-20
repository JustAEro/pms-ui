import { useUnit } from 'effector-react';
import { FC } from 'react';

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
  Text,
} from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $isLoginButtonDisabled,
  $login,
  $loginModalIsOpened,
  $password,
  closeModal,
  headerModel,
  loginButtonClicked,
  loginEdited,
  openModal,
  passwordEdited,
} from './model';

const textFontSizes = [16, 21, 30];

export const HomePage: FC = () => {
  const loginModalIsOpened = useUnit($loginModalIsOpened);
  const onOpenModal = useUnit(openModal);
  const onCloseModal = useUnit(closeModal);

  const login = useUnit($login);
  const password = useUnit($password);
  const isLoginButtonDisabled = useUnit($isLoginButtonDisabled);
  const onChangeLogin = useUnit(loginEdited);
  const onChangePassword = useUnit(passwordEdited);

  const onLoginButtonClick = useUnit(loginButtonClicked);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        <Text marginTop="50px" fontWeight="bold" fontSize={textFontSizes}>
          Добро пожаловать в систему управления проектами
        </Text>
        <Button
          onClick={onOpenModal}
          marginTop="50px"
          colorScheme="teal"
          bgColor="#319795"
          width="50%"
          height="50px"
          variant="solid"
        >
          Вход
        </Button>
        <Modal isOpen={loginModalIsOpened} onClose={onCloseModal}>
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
                  Вход в аккаунт
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
                  onClick={onLoginButtonClick}
                  disabled={isLoginButtonDisabled}
                  width="80%"
                  variant="solid"
                  colorScheme="teal"
                >
                  Войти
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

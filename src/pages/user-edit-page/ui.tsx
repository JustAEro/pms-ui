import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Project } from '@pms-ui/entities/project';
import trashIcon from '@pms-ui/shared/ui/assets/svg/trash-icon.svg';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $deleteUserFromProjectModalIsOpened,
  $deleteUserModalIsOpened,
  $isUserToEditLoading,
  $projectToBeDeletedFrom,
  $userToEdit,
  closeDeleteUserFromProjectModal,
  closeDeleteUserModal,
  deleteUserButtonClicked,
  deleteUserFromProjectButtonClicked,
  headerModel,
  openDeleteUserFromProjectModal,
  openDeleteUserModal,
  pageMounted,
} from './model';

const projectsOfUser: Project[] = [
  {
    id: '1',
    name: 'Proj1',
    description: 'desc_proj_1',
  },
  {
    id: '2',
    name: 'Proj2',
    description:
      // eslint-disable-next-line max-len
      'desc_proj_2fjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkg',
  },
  {
    id: '3',
    name: 'Proj3',
    description: 'desc_proj_3',
  },
];

const textFontSizes = [16, 21, 30];

export const UserEditPage: FC = () => {
  const userToEdit = useUnit($userToEdit);
  const isUserToEditLoading = useUnit($isUserToEditLoading);

  const deleteUserModalIsOpened = useUnit($deleteUserModalIsOpened);
  const onOpenDeleteUserModal = useUnit(openDeleteUserModal);
  const onCloseDeleteUserModal = useUnit(closeDeleteUserModal);
  const onDeleteUserButtonClick = useUnit(deleteUserButtonClicked);

  const deleteUserFromProjectModalIsOpened = useUnit(
    $deleteUserFromProjectModalIsOpened
  );
  const onOpenDeleteUserFromProjectModal = useUnit(
    openDeleteUserFromProjectModal
  );
  const onCloseDeleteUserFromProjectModal = useUnit(
    closeDeleteUserFromProjectModal
  );
  const onDeleteUserFromProjectButtonClick = useUnit(
    deleteUserFromProjectButtonClicked
  );
  const projectToBeDeletedFrom = useUnit($projectToBeDeletedFrom);

  const onPageMount = useUnit(pageMounted);

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
        {isUserToEditLoading && <Spinner marginTop="30px" />}
        {!isUserToEditLoading && userToEdit && (
          <>
            <Flex
              marginTop="30px"
              direction="row"
              alignItems="baseline"
              gap="20px"
            >
              <Text fontWeight="bold" fontSize={textFontSizes}>
                Редактирование пользователя {userToEdit.firstName}{' '}
                {userToEdit.lastName}
              </Text>
              <div style={{ marginBottom: '10px' }}>
                <Tooltip
                  hasArrow
                  bgColor="#D9D9D9"
                  color="#000000"
                  label="Удаление пользователя"
                >
                  <CloseIcon
                    onClick={onOpenDeleteUserModal}
                    width="14px"
                    height="14px"
                    cursor="pointer"
                  />
                </Tooltip>
              </div>
            </Flex>

            <SimpleGrid
              spacingY={5}
              spacingX={10}
              alignItems="center"
              marginTop="40px"
              columns={2}
            >
              <Text fontSize="18px" fontWeight="bold">
                Логин
              </Text>
              <Input variant="filled" width="120%" />
              <Text fontSize="18px" fontWeight="bold">
                Имя
              </Text>
              <Input variant="filled" width="120%" />
              <Text fontSize="18px" fontWeight="bold">
                Фамилия
              </Text>
              <Input variant="filled" width="120%" />
              <Text fontSize="18px" fontWeight="bold">
                Пароль (новый)
              </Text>
              <Input type="password" variant="filled" width="120%" />
            </SimpleGrid>
            <Flex
              marginTop="30px"
              direction="row"
              alignItems="center"
              justifyContent="center"
              gap={10}
            >
              <Button variant="solid" colorScheme="blue">
                Сохранить изменения
              </Button>
              <Button
                border="1px solid"
                borderColor="#3182CE"
                color="#3182CE"
                bgColor="#FFFFFF"
              >
                Отменить изменения
              </Button>
            </Flex>
            <Flex direction="column" alignItems="start" justifyContent="start">
              <Text
                marginTop="50px"
                marginLeft="50px"
                fontWeight="bold"
                fontSize="18px"
                alignSelf="center"
              >
                Список проектов, в которых состоит данный пользователь
              </Text>
              <VStack
                paddingBottom="10px"
                marginTop="20px"
                marginLeft="50px"
                spacing="15px"
              >
                {projectsOfUser.map((project) => (
                  <Box
                    width="50vw"
                    maxWidth="50vw"
                    bgColor="#D9D9D9"
                    key={project.id}
                    paddingLeft="20px"
                    paddingTop="10px"
                    paddingRight="20px"
                    paddingBottom="10px"
                  >
                    <Flex direction="column" justifyContent="start">
                      <Flex
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="bold" fontSize="18px">
                          {project.name}
                        </Text>
                        <Tooltip
                          marginBottom="20px"
                          placement="top-start"
                          hasArrow
                          bgColor="#D9D9D9"
                          color="#000000"
                          label="Удаление пользователя из проекта"
                        >
                          <Image
                            onClick={() => {
                              onOpenDeleteUserFromProjectModal(project.id);
                            }}
                            cursor="pointer"
                            src={trashIcon}
                            alt=""
                            w="18px"
                            h="18px"
                          />
                        </Tooltip>
                      </Flex>

                      <Flex direction="row" alignItems="center" gap={5}>
                        <Text fontSize="18px">Администратор проекта</Text>
                        <Checkbox
                          borderColor="#000000"
                          bgColor="#FFFFFF"
                          colorScheme="blue"
                        />
                      </Flex>

                      <Text fontSize="18px">{project.description}</Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Flex>

            <Modal
              size="xl"
              isOpen={deleteUserModalIsOpened}
              onClose={onCloseDeleteUserModal}
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
                      Удаление пользователя
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Text width="80%" textAlign="justify">
                      {`Вы действительно хотите удалить пользователя
                     ${userToEdit.login}? Данное действие необратимо`}
                    </Text>
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onCloseDeleteUserModal}
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
                      onClick={onDeleteUserButtonClick}
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

            <Modal
              size="xl"
              isOpen={deleteUserFromProjectModalIsOpened}
              onClose={onCloseDeleteUserFromProjectModal}
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
                      Удаление пользователя из проекта
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Text width="80%" textAlign="justify">
                      {`Вы действительно хотите удалить пользователя
                     ${userToEdit.login} из проекта ${projectToBeDeletedFrom}?`}
                    </Text>
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onCloseDeleteUserFromProjectModal}
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
                      onClick={onDeleteUserFromProjectButtonClick}
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
          </>
        )}
      </Flex>
    </Box>
  );
};

import { format } from 'date-fns';
import { useUnit } from 'effector-react';
import { FC, Fragment, useEffect } from 'react';

import { AddIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
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
  useToast,
} from '@chakra-ui/react';
import { statusKeyCanGoToColumnsValue } from '@pms-ui/entities/task';
import { controls, routes } from '@pms-ui/shared/routes';
import pencilIcon from '@pms-ui/shared/ui/assets/svg/pencil.svg';
import refreshIcon from '@pms-ui/shared/ui/assets/svg/refresh-icon.svg';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $isCloseTaskModalOpened,
  $isTaskLoading,
  $isTaskPlanLoading,
  $notificationToastId,
  $notificationToShow,
  $projectOfTask,
  $task,
  $taskPlan,
  closeTaskModalClosed,
  closeTaskModalConfirmed,
  generateTaskPlanByAIButtonClicked,
  headerModel,
  newStatusClicked,
  pageMounted,
} from './model';

const textFontSizes = [16, 21, 30];

export const TaskPage: FC = () => {
  const toast = useToast();
  const notificationToShow = useUnit($notificationToShow);
  const toastId = useUnit($notificationToastId);

  const onPageMount = useUnit(pageMounted);

  const task = useUnit($task);
  const isTaskLoading = useUnit($isTaskLoading);

  const projectOfTask = useUnit($projectOfTask);

  const onNewStatusClick = useUnit(newStatusClicked);

  const isCloseTaskModalOpened = useUnit($isCloseTaskModalOpened);
  const onCloseTaskCloseModal = useUnit(closeTaskModalClosed);
  const onConfirmCloseTaskModal = useUnit(closeTaskModalConfirmed);

  const taskPlan = useUnit($taskPlan);
  const isTaskPlanLoading = useUnit($isTaskPlanLoading);
  const onClickGenerateTaskPlanByAIButton = useUnit(
    generateTaskPlanByAIButtonClicked
  );

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  useEffect(() => {
    if (notificationToShow && !toast.isActive(toastId)) {
      toast(notificationToShow);
    }
  }, [notificationToShow, toast, toastId]);

  return (
    <Box>
      <pageHeader.ui model={headerModel} />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        fontSize="3xl"
      >
        {isTaskLoading && <Spinner marginTop="30px" />}
        {!isTaskLoading && task && (
          <>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Flex marginTop="30px" gap={10} direction="row">
                <ChevronLeftIcon
                  cursor="pointer"
                  onClick={() => {
                    controls.back();
                  }}
                />
                <Text fontWeight="bold" fontSize={21}>
                  {task.name}
                </Text>

                {task.status !== 'Завершена' && projectOfTask?.is_active && (
                  <Tooltip label="Редактировать задачу" placement="top">
                    <Image
                      onClick={() => {
                        routes.editTaskRoute.open({ taskId: task.id });
                      }}
                      cursor="pointer"
                      marginTop="10px"
                      w="16px"
                      h="16px"
                      src={pencilIcon}
                    />
                  </Tooltip>
                )}

                <Menu matchWidth>
                  <MenuButton
                    disabled={
                      task.status === 'Завершена' || !projectOfTask?.is_active
                    }
                  >
                    <Button
                      disabled={
                        task.status === 'Завершена' || !projectOfTask?.is_active
                      }
                      color="#EDF2F7"
                      marginBottom="15px"
                    >
                      <Text color="#000000">{task.status}</Text>
                    </Button>
                  </MenuButton>
                  <MenuList>
                    {task.status !== 'Завершена' && (
                      <>
                        {statusKeyCanGoToColumnsValue[task.status].map(
                          (possibleNextStatus) => (
                            <Fragment key={possibleNextStatus}>
                              <MenuItem
                                onClick={() => {
                                  onNewStatusClick({
                                    newStatus: possibleNextStatus,
                                  });
                                }}
                              >
                                <Text fontSize="16px">
                                  {possibleNextStatus}
                                </Text>
                              </MenuItem>
                              <MenuDivider />
                            </Fragment>
                          )
                        )}
                        <MenuItem
                          onClick={() => {
                            onNewStatusClick({
                              newStatus: 'Завершена',
                            });
                          }}
                        >
                          <Text fontSize="16px">Завершена</Text>
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Flex>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                <Text maxW="800px" fontSize={18}>
                  {task.description}
                </Text>
              </p>

              <HStack marginTop="30px" paddingBottom="30px" alignItems="start">
                <SimpleGrid columns={2} spacingY={8} spacingX="200px">
                  <Text fontSize="18px" fontWeight="bold">
                    Исполнитель
                  </Text>
                  <Text fontSize="18px">
                    {
                      // eslint-disable-next-line max-len
                      `${task.userExecutor.firstName} ${task.userExecutor.lastName} (${task.userExecutor.login})`
                    }
                  </Text>

                  <Text fontSize="18px" fontWeight="bold">
                    Создатель
                  </Text>
                  <Text fontSize="18px">
                    {
                      // eslint-disable-next-line max-len
                      `${task.userAuthor.firstName} ${task.userAuthor.lastName} (${task.userAuthor.login})`
                    }
                  </Text>

                  <Text fontSize="18px" fontWeight="bold">
                    Тестировщик
                  </Text>
                  <Text fontSize="18px">
                    {
                      // eslint-disable-next-line max-len
                      `${task.userTester.firstName} ${task.userTester.lastName} (${task.userTester.login})`
                    }
                  </Text>

                  <Text fontSize="18px" fontWeight="bold">
                    Дата создания
                  </Text>
                  <Text fontSize="18px">
                    {format(task.creationDate, 'dd.MM.yyyy HH:mm')}
                  </Text>

                  <Text fontSize="18px" fontWeight="bold">
                    Дата дедлайна
                  </Text>
                  <Text fontSize="18px">
                    {format(task.deadlineDate, 'dd.MM.yyyy HH:mm')}
                  </Text>
                </SimpleGrid>
              </HStack>
              {!taskPlan && (
                <Button
                  marginTop="20px"
                  width="fit-content"
                  colorScheme="teal"
                  disabled={isTaskPlanLoading}
                  onClick={onClickGenerateTaskPlanByAIButton}
                >
                  Сгенерировать план выполнения задачи с помощью ИИ{' '}
                  {isTaskPlanLoading && <Spinner marginLeft="10px" />}
                </Button>
              )}

              {taskPlan && (
                <Flex direction="column" gap="5px" marginBottom="20px">
                  <Text width="500px" fontSize="18px" fontWeight="bold">
                    Сгенерированный план выполнения задачи
                  </Text>
                  <p style={{ whiteSpace: 'pre-wrap', width: '500px' }}>
                    <Text fontSize="18px">{taskPlan}</Text>
                  </p>
                </Flex>
              )}
            </Flex>

            <Modal
              size="xl"
              isOpen={isCloseTaskModalOpened}
              onClose={onCloseTaskCloseModal}
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
                      Завершение задачи
                    </Text>
                  </Flex>
                </ModalHeader>
                <ModalBody>
                  <Spacer height="20px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Text width="80%" textAlign="justify">
                      {`Вы действительно хотите завершить задачу
                     ${task.name}? Данное действие необратимо`}
                    </Text>
                  </Flex>
                  <Spacer height="50px" />
                  <Flex alignItems="center" justifyContent="center">
                    <Button
                      onClick={onCloseTaskCloseModal}
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
                      onClick={onConfirmCloseTaskModal}
                      width="80%"
                      variant="solid"
                      colorScheme="red"
                    >
                      Завершить
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestCasesBoard: FC = () => {
  const a = 1;

  return (
    <Flex
      minWidth="320px"
      minHeight="500px"
      bgColor="#D9D9D9"
      direction="column"
    >
      <Flex direction="row" padding="10px 20px">
        <Text fontSize="18px" fontWeight="bold">
          Тестовые сценарии {a}
        </Text>
        <Spacer />
        <HStack spacing={6}>
          <Tooltip placement="top" label="Добавить сценарий">
            <AddIcon boxSize="16px" />
          </Tooltip>
          <Image src={refreshIcon} />
        </HStack>
      </Flex>
    </Flex>
  );
};

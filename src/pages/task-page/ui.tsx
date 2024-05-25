import { format } from 'date-fns';
import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import { AddIcon } from '@chakra-ui/icons';
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
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { statusKeyCanGoToColumnsValue } from '@pms-ui/entities/task';
import archiveIcon from '@pms-ui/shared/ui/assets/svg/archive-icon.svg';
import pencilIcon from '@pms-ui/shared/ui/assets/svg/pencil.svg';
import refreshIcon from '@pms-ui/shared/ui/assets/svg/refresh-icon.svg';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $isTaskLoading,
  $notificationToastId,
  $notificationToShow,
  $task,
  headerModel,
  pageMounted,
} from './model';

export const TaskPage: FC = () => {
  const toast = useToast();
  const notificationToShow = useUnit($notificationToShow);
  const toastId = useUnit($notificationToastId);

  const onPageMount = useUnit(pageMounted);

  const task = useUnit($task);
  const isTaskLoading = useUnit($isTaskLoading);

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
          <Flex direction="column">
            <Flex
              width="100%"
              marginTop="30px"
              marginLeft="50px"
              direction="row"
            >
              <Text fontSize={21}>{`#${task.id}`}</Text>
              <Text marginLeft="250px" fontWeight="bold" fontSize={21}>
                {task.name}
              </Text>
              <Tooltip label="Редактировать задачу" placement="top">
                <Image
                  marginLeft="20px"
                  cursor="pointer"
                  marginTop="10px"
                  w="16px"
                  h="16px"
                  src={pencilIcon}
                />
              </Tooltip>
              <Tooltip label="Архивировать задачу" placement="top">
                <Image
                  marginLeft="20px"
                  cursor="pointer"
                  marginTop="10px"
                  w="18px"
                  h="18px"
                  src={archiveIcon}
                />
              </Tooltip>
              <Menu matchWidth>
                <MenuButton>
                  <Button
                    color="#EDF2F7"
                    marginLeft="100px"
                    marginBottom="15px"
                  >
                    <Text color="#000000">{task.status}</Text>
                  </Button>
                </MenuButton>
                <MenuList>
                  {task.status !== 'Закрыт' && task.status !== 'Архив' && (
                    <>
                      {statusKeyCanGoToColumnsValue[task.status].map(
                        (possibleNextStatus) => (
                          <>
                            <MenuItem>
                              <Text fontSize="16px">{possibleNextStatus}</Text>
                            </MenuItem>
                            <MenuDivider />
                          </>
                        )
                      )}
                      <MenuItem>
                        <Text fontSize="16px">Закрыто</Text>
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Flex>
            <Text maxW="800px" fontSize={18} marginLeft="50px">
              {task.description}
            </Text>
            <HStack
              marginTop="30px"
              paddingLeft="50px"
              paddingRight="50px"
              paddingBottom="30px"
              alignItems="start"
            >
              <TestCasesBoard />
              <Spacer />
              <SimpleGrid columns={2} spacingY={8}>
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
                  {format(task.creationDate, 'dd.MM.yyyy hh:mm')}
                </Text>

                <Text fontSize="18px" fontWeight="bold">
                  Дата дедлайна
                </Text>
                <Text fontSize="18px">
                  {format(task.deadlineDate, 'dd.MM.yyyy hh:mm')}
                </Text>
              </SimpleGrid>
            </HStack>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

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

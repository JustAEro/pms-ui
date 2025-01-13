import { chakraComponents, NoticeProps, Select } from 'chakra-react-select';
import { useUnit } from 'effector-react';
import { FC, Fragment, useEffect } from 'react';
import { useUnmount } from 'usehooks-ts';

import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $activeUserExecutorOption,
  $activeUserTesterOption,
  $deadlineDateFieldValue,
  $isTaskLoading,
  $notificationToastId,
  $notificationToShow,
  $pageMode,
  $task,
  $taskDescriptionFieldValue,
  $taskNameFieldValue,
  $userOptions,
  backToPreviousPageClicked,
  createOrEditTaskButtonClicked,
  deadlineDateFieldValueChanged,
  executorMenuClicked,
  headerModel,
  pageMounted,
  pageUnmounted,
  taskDescriptionFieldValueChanged,
  taskNameFieldValueChanged,
  testerMenuClicked,
} from './model';
import { UserOption } from './types';

const textFontSizes = [16, 21, 30];

export const CreateEditTaskPage: FC = () => {
  const onPageMount = useUnit(pageMounted);
  const onPageUnmount = useUnit(pageUnmounted);

  const pageMode = useUnit($pageMode);

  const onBackToPreviousPageClick = useUnit(backToPreviousPageClicked);

  const taskNameFieldValue = useUnit($taskNameFieldValue);
  const onChangeTaskNameFieldValue = useUnit(taskNameFieldValueChanged);

  const taskDescriptionFieldValue = useUnit($taskDescriptionFieldValue);
  const onChangeTaskDescriptionFieldValue = useUnit(
    taskDescriptionFieldValueChanged
  );

  const isTaskLoading = useUnit($isTaskLoading);
  const task = useUnit($task);

  const onCreateOrEditTaskButtonClick = useUnit(createOrEditTaskButtonClicked);

  const toast = useToast();
  const notificationToShow = useUnit($notificationToShow);
  const toastId = useUnit($notificationToastId);

  useEffect(() => {
    if (notificationToShow) {
      toast({ ...notificationToShow, position: 'top-right' });
    }
  }, [notificationToShow, toast, toastId]);

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  useUnmount(() => {
    onPageUnmount();
    toast.closeAll();
  });

  const deadlineDate = useUnit($deadlineDateFieldValue);
  const onDeadlineDateChange = useUnit(deadlineDateFieldValueChanged);

  const onExecutorMenuClick = useUnit(executorMenuClicked);

  const userOptions = useUnit($userOptions);

  const activeUserExecutorOption = useUnit($activeUserExecutorOption);

  const activeUserTesterOption = useUnit($activeUserTesterOption);

  const onTesterMenuClick = useUnit(testerMenuClicked);

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
        {(task || pageMode === 'create') && (
          <>
            <Flex
              marginTop="30px"
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <ChevronLeftIcon
                onClick={onBackToPreviousPageClick}
                cursor="pointer"
                marginRight="2vw"
                marginLeft="-3vw"
                w="30px"
                h="30px"
              />
              <Text fontWeight="bold" fontSize={textFontSizes}>
                {pageMode === 'create'
                  ? 'Создание задачи'
                  : `Редактирование задачи `}
                {task && `${task.name}`}
              </Text>
            </Flex>
            <FormControl
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop="30px"
            >
              <FormLabel>Название задачи</FormLabel>
              <Input
                value={taskNameFieldValue}
                onChange={(e) => onChangeTaskNameFieldValue(e.target.value)}
                size="lg"
                width="70%"
                variant="filled"
              />
            </FormControl>
            <FormControl
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop="30px"
            >
              <FormLabel>Описание задачи</FormLabel>
              <Textarea
                value={taskDescriptionFieldValue}
                onChange={(e) =>
                  onChangeTaskDescriptionFieldValue(e.target.value)
                }
                size="lg"
                width="70%"
                variant="filled"
              />
            </FormControl>
            <FormControl
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop="30px"
            >
              <FormLabel>Исполнитель задачи</FormLabel>

              {/* <Menu matchWidth>
                <MenuButton disabled={false}>
                  <Button disabled={false} color="#EDF2F7" marginBottom="15px">
                    <Text color="#000000">{menuText}</Text>
                  </Button>
                </MenuButton>
                <MenuList>
                  {membersOfProject.map((member) => (
                    <Fragment key={member.user_id}>
                      <MenuItem
                        onClick={() => {
                          onExecutorMenuClick({
                            userId: member.user_id,
                            menuText: `${member.full_name} (${member.username})`,
                          });
                        }}
                      >
                        <Text fontSize="16px">{`${member.full_name} (${member.username})`}</Text>
                      </MenuItem>
                    </Fragment>
                  ))}
                </MenuList>
              </Menu> */}

              <div style={{ width: '70%' }}>
                <Select
                  size="lg"
                  variant="filled"
                  placeholder="Выберите исполнителя задачи"
                  components={{ NoOptionsMessage }}
                  options={userOptions}
                  value={activeUserExecutorOption}
                  onChange={(option: UserOption) => {
                    onExecutorMenuClick({
                      userId: option.userId,
                    });
                  }}
                />
              </div>

              {/* 
              <Input
                value={taskExecutorLoginFieldValue}
                onChange={(e) =>
                  onChangeTaskExecutorLoginFieldValue(e.target.value)
                }
                size="lg"
                width="70%"
                variant="filled"
              /> */}
            </FormControl>
            <FormControl
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop="30px"
            >
              <FormLabel>Тестировщик</FormLabel>

              <div style={{ width: '70%' }}>
                <Select
                  size="lg"
                  variant="filled"
                  placeholder="Выберите тестировщика задачи"
                  components={{ NoOptionsMessage }}
                  options={userOptions}
                  value={activeUserTesterOption}
                  onChange={(option: UserOption) => {
                    onTesterMenuClick({
                      userId: option.userId,
                    });
                  }}
                />
              </div>

              {/* <Input
                value={taskTesterLoginFieldValue}
                onChange={(e) =>
                  onChangeTaskTesterLoginFieldValue(e.target.value)
                }
                size="lg"
                width="70%"
                variant="filled"
              /> */}
            </FormControl>

            <FormControl
              display="flex"
              flexDirection="column"
              alignItems="center"
              marginTop="30px"
            >
              <FormLabel>Дата дедлайна</FormLabel>
              <input
                aria-label="Date and time"
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => {
                  const newDate = new Date(e.target.value).getTime() / 1000;

                  onDeadlineDateChange(newDate ? value(newDate) : '');
                }}
              />
            </FormControl>

            <Button
              marginTop="50px"
              marginBottom="50px"
              width="35%"
              colorScheme="teal"
              size="lg"
              onClick={onCreateOrEditTaskButtonClick}
            >
              <Text color="white" fontWeight="bold">
                {pageMode === 'create' ? 'Создать' : 'Редактировать'}
              </Text>
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

const NoOptionsMessage = (props: NoticeProps) => (
  <chakraComponents.NoOptionsMessage {...props}>
    <span>Пользователи не найдены</span>
  </chakraComponents.NoOptionsMessage>
);

function value(epcohSeconds: number) {
  return formatISOString(epochSecondsToLocalISOString(epcohSeconds));
}

function formatISOString(value: string) {
  return value.replace('Z', '');
}

function epochSecondsToLocalISOString(epochSeconds: number) {
  return new Date(
    epochSeconds * 1000 +
      -new Date(epochSeconds * 1000).getTimezoneOffset() * 60 * 1000
  ).toISOString();
}

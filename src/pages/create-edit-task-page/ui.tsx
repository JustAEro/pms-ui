import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';
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
  $deadlineDateFieldValue,
  $isTaskLoading,
  $notificationToastId,
  $notificationToShow,
  $pageMode,
  $task,
  $taskDescriptionFieldValue,
  $taskExecutorIdFieldValue,
  $taskNameFieldValue,
  $taskTesterIdFieldValue,
  backToPreviousPageClicked,
  createOrEditTaskButtonClicked,
  deadlineDateFieldValueChanged,
  headerModel,
  pageMounted,
  pageUnmounted,
  taskDescriptionFieldValueChanged,
  taskExecutorIdFieldValueChanged,
  taskNameFieldValueChanged,
  taskTesterIdFieldValueChanged,
} from './model';

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

  const taskExecutorLoginFieldValue = useUnit($taskExecutorIdFieldValue);
  const onChangeTaskExecutorLoginFieldValue = useUnit(
    taskExecutorIdFieldValueChanged
  );

  const taskTesterLoginFieldValue = useUnit($taskTesterIdFieldValue);
  const onChangeTaskTesterLoginFieldValue = useUnit(
    taskTesterIdFieldValueChanged
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
              <Input
                value={taskExecutorLoginFieldValue}
                onChange={(e) =>
                  onChangeTaskExecutorLoginFieldValue(e.target.value)
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
              <FormLabel>Тестировщик</FormLabel>
              <Input
                value={taskTesterLoginFieldValue}
                onChange={(e) =>
                  onChangeTaskTesterLoginFieldValue(e.target.value)
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

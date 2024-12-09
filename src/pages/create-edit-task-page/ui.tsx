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
} from '@chakra-ui/react';
import { header as pageHeader } from '@pms-ui/widgets/header';

import {
  $isTaskLoading,
  $pageMode,
  $task,
  $taskDescriptionFieldValue,
  $taskExecutorLoginFieldValue,
  $taskNameFieldValue,
  $taskTesterLoginFieldValue,
  backToPreviousPageClicked,
  headerModel,
  pageMounted,
  pageUnmounted,
  taskDescriptionFieldValueChanged,
  taskExecutorLoginFieldValueChanged,
  taskNameFieldValueChanged,
  taskTesterLoginFieldValueChanged,
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

  const taskExecutorLoginFieldValue = useUnit($taskExecutorLoginFieldValue);
  const onChangeTaskExecutorLoginFieldValue = useUnit(
    taskExecutorLoginFieldValueChanged
  );

  const taskTesterLoginFieldValue = useUnit($taskTesterLoginFieldValue);
  const onChangeTaskTesterLoginFieldValue = useUnit(
    taskTesterLoginFieldValueChanged
  );

  const isTaskLoading = useUnit($isTaskLoading);
  const task = useUnit($task);

  useEffect(() => {
    onPageMount();
  }, [onPageMount]);

  useUnmount(() => {
    onPageUnmount();
  });

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
                {task && `${task.id}`}
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
              <FormLabel>Вложения</FormLabel>
              <Input width="70%" type="file" />
            </FormControl>
            <Button
              marginTop="50px"
              marginBottom="50px"
              width="35%"
              colorScheme="teal"
              size="lg"
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

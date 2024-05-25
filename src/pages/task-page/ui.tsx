import { useUnit } from 'effector-react';
import { FC, useEffect } from 'react';

import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { statusKeyCanGoToColumnsValue } from '@pms-ui/entities/task';
import archiveIcon from '@pms-ui/shared/ui/assets/svg/archive-icon.svg';
import pencilIcon from '@pms-ui/shared/ui/assets/svg/pencil.svg';
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
              <Image
                marginLeft="20px"
                cursor="pointer"
                marginTop="10px"
                w="16px"
                h="16px"
                src={pencilIcon}
              />
              <Image
                marginLeft="20px"
                cursor="pointer"
                marginTop="10px"
                w="18px"
                h="18px"
                src={archiveIcon}
              />
              <Menu matchWidth>
                <MenuButton>
                  <Button marginLeft="150px" marginBottom="15px">
                    <Text>{task.status}</Text>
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
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

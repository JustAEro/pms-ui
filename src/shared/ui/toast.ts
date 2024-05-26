import { createEvent, createStore, Event, sample } from 'effector';

import { UseToastOptions } from '@chakra-ui/react';

type ToastModelProps<T> = {
  triggerEvent: Event<T>;
  notificationOptions?: UseToastOptions;
};

export const errorToastModelFactory = <T extends { error: Error }>({
  triggerEvent,
  notificationOptions,
}: ToastModelProps<T>) => {
  const reset = createEvent();

  const $notificationToastId = createStore(String(new Date()));
  const $notificationToShow = createStore<UseToastOptions | null>(null);

  sample({
    clock: triggerEvent,
    source: $notificationToastId,
    fn: (toastId, { error }) => ({
      id: toastId,
      title: error.name,
      description: error.message,
      status: 'error' as const,
      duration: 9000,
      isClosable: true,
      ...notificationOptions,
    }),
    target: $notificationToShow,
  });

  sample({
    clock: reset,
    target: [$notificationToShow.reinit, $notificationToastId.reinit],
  });

  return {
    inputs: {
      reset,
    },
    outputs: {
      $notificationToastId,
      $notificationToShow,
    },
  };
};

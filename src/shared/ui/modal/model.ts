import { createEvent, createStore, sample } from 'effector';
import { modelFactory } from 'effector-factorio';

export const modalFactory = modelFactory(() => {
  const open = createEvent();
  const close = createEvent();

  const reset = createEvent();

  const $isOpened = createStore(false);

  sample({
    clock: open,
    source: $isOpened,
    filter: (isOpened) => !isOpened,
    fn: () => true,
    target: $isOpened,
  });

  sample({
    clock: close,
    source: $isOpened,
    filter: (isOpened) => isOpened,
    fn: () => false,
    target: $isOpened,
  });

  sample({
    clock: reset,
    target: $isOpened.reinit,
  });

  return {
    inputs: {
      open,
      close,
      reset,
    },
    ui: {
      $isOpened,
    },
  };
});

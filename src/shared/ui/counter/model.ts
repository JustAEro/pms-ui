import { createEvent, createStore, sample } from 'effector';
import { modelFactory } from 'effector-factorio';

type CounterFactoryOptions = {
  initialCount: number;
};

export const counterFactory = modelFactory(
  (options?: CounterFactoryOptions) => {
    const counterIncrementButtonClicked = createEvent();
    const counterResetButtonClicked = createEvent();
    const counterIncrement = createEvent();
    const reset = createEvent();

    const $count = createStore(options?.initialCount ?? 0);

    sample({
      clock: counterIncrementButtonClicked,
      target: counterIncrement,
    });

    sample({
      clock: counterIncrement,
      source: $count,
      fn: (count) => count + 1,
      target: $count,
    });

    sample({
      clock: counterResetButtonClicked,
      target: reset,
    });

    sample({
      clock: reset,
      target: $count.reinit,
    });

    return {
      inputs: {
        reset,
      },
      ui: {
        $count: $count.map((_) => _),
        counterIncrementButtonClicked,
        counterResetButtonClicked,
      },
    };
  }
);

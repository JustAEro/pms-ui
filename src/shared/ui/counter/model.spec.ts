import { allSettled, createWatch, fork } from 'effector';

import { counterFactory } from './model';

describe('shared/ui/counter', () => {
  let scope = fork();

  beforeEach(() => {
    scope = fork();
  });

  it('count increments by 1 after counterIncrementButtonClicked', async () => {
    const model = counterFactory.createModel();

    await allSettled(model.ui.counterIncrementButtonClicked, { scope });

    expect(scope.getState(model.ui.$count)).toEqual(1);
  });

  it('count increments correctly after passing initial value', async () => {
    const model = counterFactory.createModel({ initialCount: 5 });

    await allSettled(model.ui.counterIncrementButtonClicked, { scope });

    expect(scope.getState(model.ui.$count)).toEqual(6);
  });

  it('count resets correctly after passing initial value', async () => {
    const model = counterFactory.createModel({ initialCount: 5 });
    await allSettled(model.ui.counterIncrementButtonClicked, { scope });

    await allSettled(model.inputs.reset, { scope });

    expect(scope.getState(model.ui.$count)).toEqual(5);
  });

  it('count reinits to 0 after counterResetButtonClicked', async () => {
    const model = counterFactory.createModel();
    await allSettled(model.ui.counterIncrementButtonClicked, { scope });

    await allSettled(model.ui.counterResetButtonClicked, { scope });

    expect(scope.getState(model.ui.$count)).toEqual(0);
  });

  it('count resets to 0 after reset call', async () => {
    const model = counterFactory.createModel();
    await allSettled(model.ui.counterIncrementButtonClicked, { scope });

    await allSettled(model.inputs.reset, { scope });

    expect(scope.getState(model.ui.$count)).toEqual(0);
  });

  it('calls reset after counterResetButtonClicked', async () => {
    const model = counterFactory.createModel();
    await allSettled(model.ui.counterIncrementButtonClicked, { scope });
    const resetSpyFn = jest.fn();
    createWatch({ scope, fn: resetSpyFn, unit: model.inputs.reset });

    await allSettled(model.ui.counterResetButtonClicked, { scope });

    expect(resetSpyFn).toHaveBeenCalled();
  });
});

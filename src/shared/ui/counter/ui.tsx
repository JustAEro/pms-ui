import { modelView } from 'effector-factorio';
import { useUnit } from 'effector-react';

import { Button, Flex } from '@chakra-ui/react';

import { counterFactory } from './model';

type CounterParams = {
  textFontSizes: number[];
};

export const Counter = modelView(
  counterFactory,
  ({ textFontSizes }: CounterParams) => {
    const model = counterFactory.useModel();
    const count = useUnit(model.ui.$count);
    const onCounterIncrementButtonClick = useUnit(
      model.ui.counterIncrementButtonClicked
    );
    const onCounterResetButtonClick = useUnit(
      model.ui.counterResetButtonClicked
    );

    return (
      <Flex direction="row" gap={2}>
        <Button
          colorScheme="blue"
          fontSize={textFontSizes}
          onClick={onCounterIncrementButtonClick}
          marginTop="2"
        >
          Count is: {count}
        </Button>
        <Button
          colorScheme="blue"
          fontSize={textFontSizes}
          onClick={onCounterResetButtonClick}
          marginTop="2"
        >
          Reset
        </Button>
      </Flex>
    );
  }
);

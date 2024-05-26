import { createEffect } from 'effector';

import { TestScenario } from './types';

export const testSceanrios: TestScenario[] = [
  {
    id: '111',
    taskId: '4',
    testCases: [
      {
        status: 'pass',
      },
      { status: 'fail' },
    ],
  },
  {
    id: '222',
    taskId: '4',
    testCases: [
      {
        status: 'pass',
      },
      { status: 'fail' },
    ],
  },
  {
    id: '222',
    taskId: '4',
    testCases: [
      {
        status: 'pass',
      },
      { status: 'fail' },
    ],
  },
];

export const fetchTestScenariosOfTask = createEffect(
  async ({ taskId }: { taskId: string }) =>
    new Promise<TestScenario[]>((resolve) => {
      setTimeout(() => {
        const foundScenarios = testSceanrios.filter(
          (sc) => sc.taskId === taskId
        );

        resolve(foundScenarios);
      }, 1000);
    })
);

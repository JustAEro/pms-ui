export type TestCase = {
  status: 'pass' | 'fail';
};

export type TestScenario = {
  id: string;
  taskId: string;
  testCases: TestCase[];
};

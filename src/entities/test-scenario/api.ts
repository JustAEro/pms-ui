// import { createEffect } from 'effector';

// import { TestScenario } from './types';

// export const testSceanrios: TestScenario[] = [
//   {
//     id: '111',
//     taskId: '4',
//     testCases: [
//       {
//         status: 'pass',
//       },
//       { status: 'fail' },
//     ],
//   },
//   {
//     id: '222',
//     taskId: '4',
//     testCases: [
//       {
//         status: 'pass',
//       },
//       { status: 'fail' },
//     ],
//   },
//   {
//     id: '222',
//     taskId: '4',
//     testCases: [
//       {
//         status: 'pass',
//       },
//       { status: 'fail' },
//     ],
//   },
// ];

// export const fetchTestScenariosOfTask = createEffect(
//   async ({ taskId }: { taskId: string }) =>
//     new Promise<TestScenario[]>((resolve, reject) => {
//       setTimeout(() => {
//         const foundUser = tasks.find((task) => task.id === taskId);

//         if (foundUser) {
//           resolve(foundUser);
//         } else {
//           reject(new Error(`Task with id ${taskId} is not found`));
//         }
//       }, 1000);
//     })
// );

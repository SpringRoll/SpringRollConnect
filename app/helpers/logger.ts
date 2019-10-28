// Declare an "log stream" for bunyan to write to a file
import { createLogger } from 'bunyan';

const streams = [
  {
    level: 'info',
    path: process.env.OUTPUT_LOG
  }
];

// //If we're not in production also log to standard out
// if (process.env.NODE_ENV !== 'production') {
//   streams.push({
//     level: 'info',
//     stream: "" + process.stdout
//   });
// }

export const log = createLogger({
  name: 'springroll-connect',
  streams: [
    {
      //@ts-ignore
      level: 'info',
      path: process.env.OUTPUT_LOG
    },
    {
      //@ts-ignore
      level: 'info',
      //@ts-ignore
      stream: process.stdout
    }
  ]
});

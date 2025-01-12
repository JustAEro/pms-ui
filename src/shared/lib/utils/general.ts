import { CreateStyled } from '@emotion/styled';

export const transientOptions: Parameters<CreateStyled>[1] = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$'),
};

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return `${str.slice(0, maxLength - 3)}...`;
  }

  return str;
}

export function convertToMoscowTime(isoDate: Date | string) {
  // Parse the ISO date string into a Date object
  const date = new Date(isoDate);

  // Get the UTC offset for Moscow (in minutes)
  const moscowTimezoneOffset = 3 * 60; // Moscow is UTC+3

  // Adjust the time to Moscow time
  const moscowTime = new Date(
    date.getTime() + moscowTimezoneOffset * 60 * 1000
  );

  // Format the date in the desired format
  const year = moscowTime.getUTCFullYear();
  const month = String(moscowTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(moscowTime.getUTCDate()).padStart(2, '0');
  const hours = String(moscowTime.getUTCHours()).padStart(2, '0');
  const minutes = String(moscowTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(moscowTime.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(moscowTime.getUTCMilliseconds()).padStart(3, '0');

  // Construct the timezone offset string
  const timezoneOffset = '+03:00';

  // Construct the final string
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffset}`;
}

export function convertToUTC(moscowDate: string) {
  // Parse the string to extract date, time, and timezone offset
  const [datePart, timePart] = moscowDate.split('T');
  const [time, timezoneOffset] = timePart!.split('+');
  const [hours, minutes] = timezoneOffset!.split(':').map(Number);

  // Convert the Moscow time to UTC
  const timezoneOffsetMinutes = hours! * 60 + minutes!; // +03:00 is 180 minutes
  const date = new Date(`${datePart}T${time}Z`);
  const utcTime = new Date(date.getTime() - timezoneOffsetMinutes * 60 * 1000);

  // Format the UTC time in ISO format
  return utcTime.toISOString();
}

export function convertDateToUTC(date: Date) {
  // Ensure the input is a Date object
  const utcYear = date.getUTCFullYear();
  const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
  const utcDay = String(date.getUTCDate()).padStart(2, '0');
  const utcHours = String(date.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(date.getUTCSeconds()).padStart(2, '0');
  const utcMilliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  // Construct and return the ISO string in UTC
  return `${utcYear}-${utcMonth}-${utcDay}T${utcHours}:${utcMinutes}:${utcSeconds}.${utcMilliseconds}Z`;
}

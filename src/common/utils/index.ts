import * as bcrypt from 'bcrypt';

const hashData = (data: String) => {
  return bcrypt.hash(data, 10);
};

const comparePassword = async (oldPass: String, newPass: String) => {
  return await bcrypt.compare(oldPass, newPass);
};

type TimeSpanUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w';

const TimeSpan = (value: number, unit: TimeSpanUnit) => {
  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 1000 * 60;
    case 'h':
      return value * 1000 * 60 * 60;
    case 'd':
      return value * 1000 * 60 * 60 * 24;
    default:
      return value * 1000 * 60 * 60 * 24 * 7;
  }
};

const seconds = (milliseconds) => {
  return milliseconds / 1000;
};

const isWithinExpirationDate = (date: Date): boolean => {
  return Date.now() < date.getTime();
};

const createDate = (milliseconds): Date => {
  return new Date(Date.now() + milliseconds);
};

export {
  isWithinExpirationDate,
  TimeSpan,
  TimeSpanUnit,
  createDate,
  seconds,
  hashData,
  comparePassword,
};

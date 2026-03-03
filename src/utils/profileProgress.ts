import { User } from '../types/api';

const PROFILE_FIELDS: (keyof User)[] = [
  'firstName',
  'lastName',
  'phone',
  'country',
  'city',
  'address',
  'institute',
  'jobStatus',
  'jobLocation',
  'yearOfGraduation',
  'cnic',
  'cnicFront',
  'cnicBack',
];

const INVALID_STRING_VALUES = ['undefined', 'null'];

const isValidValue = (value: unknown): boolean => {
  // real null / undefined
  if (value === null || value === undefined) return false;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized.length === 0) return false;
    if (INVALID_STRING_VALUES.includes(normalized)) return false;

    return true;
  }

  return true;
};

export const calculateProfileProgress = (user?: User | null): number => {
  if (!user) return 0;

  const completed = PROFILE_FIELDS.filter((key) =>
    isValidValue(user[key])
  ).length;

  return Math.round((completed / PROFILE_FIELDS.length) * 100);
};

export const isProfileComplete = (user?: User | null): boolean => {
  return calculateProfileProgress(user) === 100;
};

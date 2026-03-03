import api from './client';
import { USERS } from './endpoints';

export const getUserPackages = (userId: string) => {
  return api.get(USERS.PACKAGES(userId));
};

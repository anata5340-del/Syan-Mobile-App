import { useQuery } from '@tanstack/react-query';
import { getUserPackages } from '../../api/subscription.service';

export const useUserSubscriptions = (userId?: string) => {
  return useQuery({
    queryKey: ['user-packages', userId],
    queryFn: () => getUserPackages(userId as string),
    enabled: !!userId, // very important
  });
};

import { useQuery } from '@tanstack/react-query';
import { getUserPackages } from '../../api/invoice.service';
import { InvoiceResponse } from '../../types/invoice';

export function useInvoices(userId: string) {
  return useQuery<InvoiceResponse>({
    queryKey: ['user-packages', userId],
    queryFn: () => getUserPackages(userId),
    enabled: !!userId,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
}

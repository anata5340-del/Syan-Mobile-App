import api from './client';
import { USERS } from './endpoints';
import { InvoiceResponse } from '../types/invoice';

export async function getUserPackages(userId: string): Promise<InvoiceResponse> {
  const { data } = await api.get(USERS.PACKAGES(userId));
  console.log('Fetched user packages:', data);
  return data;
}

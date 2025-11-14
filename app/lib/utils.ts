import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

const numberFormatter = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});

export const formatDistance = (value: number) => `${numberFormatter.format(value)} km`;

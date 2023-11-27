import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classnames
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const url = () => {
  return (
    process.env.SITE_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000'
  );
};

/**
 * Determines the default URL for the application.
 */
// don't ask.
export const defaultUrl = url();

export { formatDate, formatDateTime } from './lib/date';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classnames
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getUrl = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000' ??
    'http://localhost:3001';

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}/`;

  return url;
};

/**
 * Determines the default URL for the application.
 */
// don't ask.
export const defaultUrl = getUrl();

export { formatDate, formatDateTime } from './lib/date';

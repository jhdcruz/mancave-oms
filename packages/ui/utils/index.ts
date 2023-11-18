import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge classnames, primarily used only in shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Determines the default URL for the application.
 */
export const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

/**
 * Merge classnames, primarily used only in shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date/timestamp into a human-readable date format.
 */
export function formatDate(input: string | number): string {
  const date = new Date(input);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date/timestamp into a human-readable date & time format.
 */
export function formatDateTime(input: string | number): string {
  const date = new Date(input);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

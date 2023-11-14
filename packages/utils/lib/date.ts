/**
 * Format `date` or `timestamp` into a human-readable date format.
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
 * Format `date` or `timestamp` into a human-readable date & time format.
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

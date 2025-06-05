/**
 * Checks if the application is running in development mode.
 * @returns True if the app is running in development mode, false otherwise.
 */
export function isAppDevMode() {
    return process.env.NODE_ENV === "development";
}

/**
 * Turns a date into a human-readable format (e.g., "March 2020").
 * @returns String version of a date in a human-readable format.
 */
export function formatDateToMonthYear(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
    });
}
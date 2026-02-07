import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: any): string {
  const date = typeof input === "number"
    ? new Date(input)              // MS timestamp
    : new Date(input);             // ISO string

  if (isNaN(date.getTime())) return ""; // Prevent invalid date

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60_000;
  const hour = 3_600_000;
  const day = 86_400_000;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)} min ago`;
  if (diff < day) return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  if (diff < day * 2) return "Yesterday";

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function formatDateforChat(input: any): string {
  const date = typeof input === "number"
    ? new Date(input)              // MS timestamp
    : new Date(input);             // ISO string

  if (isNaN(date.getTime())) return ""; // Prevent invalid date

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const day = 86_400_000;

  if (diff < day) return `Today`;
  if (diff < day * 2) return "Yesterday";

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

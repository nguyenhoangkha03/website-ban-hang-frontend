import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) {
    return '/placeholder.jpg';
  }
  // If the path is already a full URL, return it as is.
  if (path.startsWith('http')) {
    return path;
  }
  // Otherwise, prepend the API URL.
  return `${API_URL}${path}`;
};
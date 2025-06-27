import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | bigint): string {
  let num: number;
  
  try {
    if (typeof amount === 'bigint') {
      // Safely convert bigint to number to avoid precision errors
      // First divide by 10^14 to get to a safe number range, then by 10^4 for the final conversion
      const divisor1 = BigInt(10 ** 14);
      const divisor2 = 10 ** 4;
      const safeNum = Number(amount / divisor1) / divisor2;
      num = safeNum;
    } else {
      num = typeof amount === 'string' ? parseFloat(amount) : amount;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(num);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0.00'; // Fallback value
  }
}

export function formatDate(date: Date | string | number): string {
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else if (typeof date === 'number') {
    d = new Date(date * 1000); // Convert timestamp to milliseconds
  } else {
    d = date;
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function calculateLoanInterest(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 100 / 12;
  const totalAmount = principal * Math.pow(1 + monthlyRate, months);
  return totalAmount - principal;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely converts a Date or timestamp to a BigInt representation of Unix seconds
 * Uses Math.floor to ensure the value is an integer before conversion
 * 
 * @param date - Date object or timestamp to convert
 * @returns BigInt representation of the date in Unix seconds
 */
export function dateToBigIntSeconds(date?: Date | number): bigint {
  if (!date) {
    // Default to current time if no date provided
    return BigInt(Math.floor(Date.now() / 1000));
  }
  
  // Convert Date object to timestamp if needed
  const timestamp = date instanceof Date ? date.getTime() : date;
  
  // Convert to seconds and ensure it's an integer
  return BigInt(Math.floor(timestamp / 1000));
}

/**
 * Adds seconds to a BigInt timestamp
 * 
 * @param timestamp - Base timestamp as BigInt
 * @param seconds - Number of seconds to add
 * @returns New BigInt timestamp
 */
export function addSecondsToBigInt(timestamp: bigint, seconds: number): bigint {
  return timestamp + BigInt(seconds);
}
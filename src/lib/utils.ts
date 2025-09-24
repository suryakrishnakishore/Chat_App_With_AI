import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp*1000);
  const curDate: Date = new Date();
  const diffInMilliseconds = Math.abs(date.getTime() - curDate.getTime());
  console.log(date, "     ", curDate);
  
  const millisecondsInSecond = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;

  const millisecondsInMinute = millisecondsInSecond * secondsInMinute;
  const millisecondsInHour = millisecondsInMinute * minutesInHour;
  const millisecondsInDay = millisecondsInHour * hoursInDay;

  const days = Math.floor(diffInMilliseconds / millisecondsInDay);
  const hours = Math.floor((diffInMilliseconds % millisecondsInDay) / millisecondsInHour);
  const minutes = Math.floor((diffInMilliseconds % millisecondsInHour) / millisecondsInMinute);

  let formatedDate: string;
  if(days == 0) {
    if(hours == 0) {
      if(minutes == 0) formatedDate = "Just Now";
      else if (minutes === 1) formatedDate = "1 minute ago";
      else formatedDate = `${minutes} minutes ago`;
    }
    else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      formatedDate = `${hours}:${minutes}`;
    }
  }
  else if (days == 1) {
    formatedDate = "Yesterday";
  }
  else {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    formatedDate = `${day}/${month}/${year}`;
  }

  return formatedDate;
}
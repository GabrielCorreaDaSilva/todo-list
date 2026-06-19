import { format, differenceInCalendarDays, startOfToday, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function parseInputToDate(date) {
    return parse(
        date,
        "yyyy-MM-dd",
        new Date()
    )
}

export const isWithinWeek = (date) => {
    const today = startOfToday();
    return differenceInCalendarDays(date, today) < 7
}

export const formatWeekDay = (date) => {
    return format((date), 'eee')
}
export const formatDayMonth = (date) => {
    return format(date, "d MMM");
}
export const formatToInputString = (date) => {
    return format(date,"yyyy-MM-dd")
}
export function getRandomDateInNext20Days() {
  const today = new Date();

  const twentyDaysInMs = 20 * 24 * 60 * 60 * 1000; 
  
  const randomMs = Math.random() * twentyDaysInMs; 
  
  return new Date(today.getTime() + randomMs);
}

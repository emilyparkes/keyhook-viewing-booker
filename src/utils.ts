export type TimeSlot = { 
  date: string;
  startAt: string; 
  endAt: string 
};

export const sortTimeByEarliestStartAt = (availability:  TimeSlot[]): TimeSlot[] => {
  const sortedTimeSlots = availability.sort((a, b) => a.startAt.localeCompare(b.startAt))
  return sortedTimeSlots
}

export const availableSlotsForSelectedDate = (availability: TimeSlot[], selectedDate: string): TimeSlot[] => {
  const availableForSelectedDate = availability.filter(available => available.date === selectedDate)
  return sortTimeByEarliestStartAt(availableForSelectedDate)
}

export function generateTimeSlotsForDate(date: string, start = "08:00", end = "19:00") {
  const slots: TimeSlot[] = []
  let [hour, minute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)

  const pad = (n: number) => String(n).padStart(2, '0')

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    const startTime = `${pad(hour)}:${pad(minute)}`

    minute += 30
    if (minute === 60) {
      minute = 0
      hour += 1
    }

    const endTime = `${pad(hour)}:${pad(minute)}`
    slots.push({ date, startAt: startTime, endAt: endTime })
  }

  return slots
}

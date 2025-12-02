import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/es';

dayjs.extend(isSameOrAfter);
dayjs.locale('es');

const DEFAULT_OPTIONS = {
  startHour: 9,
  endHour: 17,
  step: 30,
  excludeSundays: true,
  days: 14,
};

const buildSlotLabel = (slot) => slot.format('HH:mm');
const buildDayLabel = (day) => day.format('ddd DD/MM');

export const twoWeekSlots = (options = {}) => {
  const { startHour, endHour, step, excludeSundays, days } = { ...DEFAULT_OPTIONS, ...options };
  const now = dayjs();
  const results = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const currentDay = now.startOf('day').add(dayOffset, 'day');

    if (excludeSundays && currentDay.day() === 0) {
      continue;
    }

    const slots = [];
    let slot = currentDay.hour(startHour).minute(0).second(0).millisecond(0);
    const dayEnd = currentDay.hour(endHour).minute(0).second(0).millisecond(0);

    while (slot.isBefore(dayEnd)) {
      if (slot.isSameOrAfter(now)) {
        slots.push({
          iso: slot.toISOString(),
          label: buildSlotLabel(slot),
        });
      }
      slot = slot.add(step, 'minute');
    }

    if (slots.length > 0) {
      results.push({
        date: currentDay.format('YYYY-MM-DD'),
        iso: currentDay.toISOString(),
        label: buildDayLabel(currentDay),
        slots,
      });
    }
  }

  return results;
};

export default twoWeekSlots;

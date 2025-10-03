import dayjs from 'dayjs';

export const OCCUPIED_APPOINTMENTS = [
  '2025-10-10T10:30:00.000Z',
  '2025-10-11T14:00:00.000Z',
  dayjs().startOf('day').add(1, 'day').hour(11).minute(0).second(0).millisecond(0).toISOString(),
  dayjs().startOf('day').add(2, 'day').hour(13).minute(30).second(0).millisecond(0).toISOString(),
];

export default OCCUPIED_APPOINTMENTS;

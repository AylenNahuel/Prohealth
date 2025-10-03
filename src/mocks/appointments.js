import dayjs from 'dayjs';

const today = dayjs().startOf('day');

export const APPOINTMENT_MOCKS = [
  {
    id: 'APT-001',
    nombre: 'Juan P�rez',
    telefono: '1122334455',
    email: 'juanp@example.com',
    obra: 'OSDE',
    slotISO: today.add(0, 'day').hour(10).minute(30).toISOString(),
    estado: 'SOLICITADA',
  },
  {
    id: 'APT-002',
    nombre: 'Mar�a L�pez',
    telefono: '1199887766',
    email: 'maria@example.com',
    obra: 'Swiss Medical',
    slotISO: today.add(1, 'day').hour(14).minute(0).toISOString(),
    estado: 'CONFIRMADA',
  },
  {
    id: 'APT-003',
    nombre: 'Carlos Rodr�guez',
    telefono: '1133557799',
    email: 'carlosr@example.com',
    obra: 'Galeno',
    slotISO: today.add(2, 'day').hour(9).minute(30).toISOString(),
    estado: 'SOLICITADA',
  },
  {
    id: 'APT-004',
    nombre: 'Ana Mart�nez',
    telefono: '1144778899',
    email: 'ana.martinez@example.com',
    obra: 'Medif�',
    slotISO: today.add(3, 'day').hour(11).minute(0).toISOString(),
    estado: 'CONFIRMADA',
  },
  {
    id: 'APT-005',
    nombre: 'Luc�a Fern�ndez',
    telefono: '1177665544',
    email: 'luciaf@example.com',
    obra: 'IOMA',
    slotISO: today.add(4, 'day').hour(15).minute(30).toISOString(),
    estado: 'SOLICITADA',
  },
  {
    id: 'APT-006',
    nombre: 'Diego �lvarez',
    telefono: '1155994477',
    email: 'diego.alvarez@example.com',
    obra: 'OSDE',
    slotISO: today.add(0, 'day').hour(16).minute(0).toISOString(),
    estado: 'CONFIRMADA',
  },
];

export const OCCUPIED_APPOINTMENTS = APPOINTMENT_MOCKS.filter(
  (appointment) => appointment.estado === 'CONFIRMADA'
).map((appointment) => appointment.slotISO);

export default APPOINTMENT_MOCKS;

import dayjs from 'dayjs';

const today = dayjs().startOf('day');

export const APPOINTMENT_MOCKS = [
  { id: 'APT-001', nombre: 'Juan Pérez', telefono: '1122334455', email: 'juanp@example.com', obra: 'OSDE', slotISO: today.add(0, 'day').hour(10).minute(30).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-002', nombre: 'María López', telefono: '1199887766', email: 'maria@example.com', obra: 'Swiss Medical', slotISO: today.add(1, 'day').hour(14).minute(0).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-003', nombre: 'Carlos Rodríguez', telefono: '1133557799', email: 'carlosr@example.com', obra: 'Galeno', slotISO: today.add(2, 'day').hour(9).minute(30).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-004', nombre: 'Ana Martínez', telefono: '1144778899', email: 'ana.martinez@example.com', obra: 'Medifé', slotISO: today.add(3, 'day').hour(11).minute(0).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-005', nombre: 'Lucía Fernández', telefono: '1177665544', email: 'luciaf@example.com', obra: 'IOMA', slotISO: today.add(4, 'day').hour(15).minute(30).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-006', nombre: 'Diego Álvarez', telefono: '1155994477', email: 'diego.alvarez@example.com', obra: 'OSDE', slotISO: today.add(0, 'day').hour(16).minute(0).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-007', nombre: 'Sofía Torres', telefono: '1160012233', email: 'sofia.torres@example.com', obra: 'OMINT', slotISO: today.add(1, 'day').hour(9).minute(0).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-008', nombre: 'Martín Gómez', telefono: '1161122334', email: 'martin.gomez@example.com', obra: 'OSDE', slotISO: today.add(1, 'day').hour(10).minute(15).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-009', nombre: 'Valentina Ruiz', telefono: '1162233445', email: 'valen.ruiz@example.com', obra: 'Swiss Medical', slotISO: today.add(1, 'day').hour(11).minute(45).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-010', nombre: 'Federico Díaz', telefono: '1163344556', email: 'fede.diaz@example.com', obra: 'Galeno', slotISO: today.add(2, 'day').hour(8).minute(45).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-011', nombre: 'Camila Herrera', telefono: '1164455667', email: 'camila.herrera@example.com', obra: 'IOMA', slotISO: today.add(2, 'day').hour(13).minute(0).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-012', nombre: 'Nicolás Sosa', telefono: '1165566778', email: 'n.sosa@example.com', obra: 'Medifé', slotISO: today.add(2, 'day').hour(16).minute(30).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-013', nombre: 'Julieta Castro', telefono: '1166677889', email: 'juli.castro@example.com', obra: 'OSDE', slotISO: today.add(3, 'day').hour(9).minute(20).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-014', nombre: 'Gonzalo Vega', telefono: '1167788990', email: 'gvega@example.com', obra: 'OMINT', slotISO: today.add(3, 'day').hour(10).minute(50).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-015', nombre: 'Agustina Romero', telefono: '1168899001', email: 'agustina.romero@example.com', obra: 'Swiss Medical', slotISO: today.add(3, 'day').hour(12).minute(10).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-016', nombre: 'Pablo Medina', telefono: '1169900112', email: 'p.medina@example.com', obra: 'Galeno', slotISO: today.add(4, 'day').hour(9).minute(35).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-017', nombre: 'Brenda Ávila', telefono: '1170011223', email: 'brenda.avila@example.com', obra: 'IOMA', slotISO: today.add(4, 'day').hour(11).minute(5).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-018', nombre: 'Hernán López', telefono: '1171122334', email: 'hernan.lopez@example.com', obra: 'Medifé', slotISO: today.add(4, 'day').hour(14).minute(40).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-019', nombre: 'Micaela Pereyra', telefono: '1172233445', email: 'mica.pereyra@example.com', obra: 'OSDE', slotISO: today.add(5, 'day').hour(10).minute(0).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-020', nombre: 'Tomás Navarro', telefono: '1173344556', email: 'tomas.navarro@example.com', obra: 'OMINT', slotISO: today.add(5, 'day').hour(12).minute(30).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-021', nombre: 'Daniela Suárez', telefono: '1174455667', email: 'daniela.suarez@example.com', obra: 'Swiss Medical', slotISO: today.add(5, 'day').hour(15).minute(0).toISOString(), estado: 'SOLICITADA' },
  { id: 'APT-022', nombre: 'Ramiro Ortega', telefono: '1175566778', email: 'ramiro.ortega@example.com', obra: 'Galeno', slotISO: today.add(6, 'day').hour(9).minute(10).toISOString(), estado: 'CONFIRMADA' },
  { id: 'APT-023', nombre: 'Elena Acosta', telefono: '1176677889', email: 'elena.acosta@example.com', obra: 'IOMA', slotISO: today.add(6, 'day').hour(11).minute(20).toISOString(), estado: 'SOLICITADA' },
];

export const OCCUPIED_APPOINTMENTS = APPOINTMENT_MOCKS.filter(
  (appointment) => appointment.estado === 'CONFIRMADA'
).map((appointment) => appointment.slotISO);

export default APPOINTMENT_MOCKS;


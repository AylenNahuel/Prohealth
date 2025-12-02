const { Resend } = require('resend');
const env = require('../config/env');

let client;

const getClient = () => {
  const apiKey = env.email?.resendApiKey;
  if (!apiKey) {
    return null;
  }
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
};

const isEmailConfigured = () =>
  Boolean(env.email?.resendApiKey && env.email?.from);

const formatSlotDateTime = (slotISO) => {
  if (!slotISO) return '-';
  const date = new Date(slotISO);
  if (Number.isNaN(date.getTime())) {
    return slotISO;
  }
  const pad = (value) => String(value).padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes} hs`;
};

const formatAppointmentHtml = (appointment) => `
  <h1>Hemos recibido tu solicitud de turno</h1>
  <p>En breve nos vamos a contactar para confirmarlo.</p>
  <p><strong>Paciente:</strong> ${appointment.patientName}</p>
  <p><strong>Email:</strong> ${appointment.email}</p>
  <p><strong>Teléfono:</strong> ${appointment.phone}</p>
  <p><strong>Obra social:</strong> ${appointment.insuranceName} (${appointment.insuranceId})</p>
  <p><strong>Fecha y hora:</strong> ${formatSlotDateTime(appointment.slotISO)}</p>
  <p><strong>Notas:</strong> ${appointment.notes || '-'}</p>
`;

const formatAppointmentText = (appointment) =>
  [
    'Hemos recibido tu solicitud de turno.',
    'En breve nos vamos a contactar para confirmarlo.',
    `Paciente: ${appointment.patientName}`,
    `Email: ${appointment.email}`,
    `Teléfono: ${appointment.phone}`,
    `Obra social: ${appointment.insuranceName} (${appointment.insuranceId})`,
    `Fecha y hora: ${formatSlotDateTime(appointment.slotISO)}`,
    `Notas: ${appointment.notes || '-'}`,
  ].join('\n');

const sendAppointmentNotification = async (appointment) => {
  if (!isEmailConfigured()) {
    console.warn('[email] Notificaciones deshabilitadas (falta configuración en .env)');
    return;
  }

  const resend = getClient();
  if (!resend) {
    console.warn('[email] Resend no inicializado (API key ausente)');
    return;
  }

  const subject = `Nuevo turno solicitado - ${appointment.patientName}`;

  await resend.emails.send({
    from: env.email.from,
    to: appointment.email,
    subject,
    html: formatAppointmentHtml(appointment),
    text: formatAppointmentText(appointment),
  });
};

const formatCancellationHtml = (appointment) => `
  <h1>Tu turno fue cancelado</h1>
  <p>Si necesitás reprogramarlo, podés solicitar un nuevo turno desde la web.</p>
  <p><strong>Paciente:</strong> ${appointment.patientName}</p>
  <p><strong>Email:</strong> ${appointment.email}</p>
  <p><strong>Teléfono:</strong> ${appointment.phone}</p>
  <p><strong>Obra social:</strong> ${appointment.insuranceName} (${appointment.insuranceId})</p>
  <p><strong>Fecha y hora:</strong> ${formatSlotDateTime(appointment.slotISO)}</p>
  <p><strong>Notas:</strong> ${appointment.notes || '-'}</p>
`;

const formatCancellationText = (appointment) =>
  [
    'Tu turno fue cancelado.',
    'Si necesitás reprogramarlo, podés solicitar un nuevo turno desde la web.',
    `Paciente: ${appointment.patientName}`,
    `Email: ${appointment.email}`,
    `Teléfono: ${appointment.phone}`,
    `Obra social: ${appointment.insuranceName} (${appointment.insuranceId})`,
    `Fecha y hora: ${formatSlotDateTime(appointment.slotISO)}`,
    `Notas: ${appointment.notes || '-'}`,
  ].join('\n');

const sendAppointmentCancellation = async (appointment) => {
  if (!isEmailConfigured()) {
    console.warn('[email] Notificaciones deshabilitadas (falta configuración en .env)');
    return;
  }

  const resend = getClient();
  if (!resend) {
    console.warn('[email] Resend no inicializado (API key ausente)');
    return;
  }

  const subject = `Turno cancelado - ${appointment.patientName}`;

  await resend.emails.send({
    from: env.email.from,
    to: appointment.email,
    subject,
    html: formatCancellationHtml(appointment),
    text: formatCancellationText(appointment),
  });
};

const formatConfirmationHtml = (appointment) => `
  <h1>Tu turno fue confirmado</h1>
  <p>Te esperamos en nuestro consultorio.</p>
  <p><strong>Paciente:</strong> ${appointment.patientName}</p>
  <p><strong>Email:</strong> ${appointment.email}</p>
  <p><strong>Teléfono:</strong> ${appointment.phone}</p>
  <p><strong>Obra social:</strong> ${appointment.insuranceName} (${appointment.insuranceId})</p>
  <p><strong>Fecha y hora:</strong> ${formatSlotDateTime(appointment.slotISO)}</p>
  <p><strong>Notas:</strong> ${appointment.notes || '-'}</p>
`;

const formatConfirmationText = (appointment) =>
  [
    'Tu turno fue confirmado.',
    'Te esperamos en nuestro consultorio.',
    `Paciente: ${appointment.patientName}`,
    `Email: ${appointment.email}`,
    `Teléfono: ${appointment.phone}`,
    `Obra social: ${appointment.insuranceName} (${appointment.insuranceId})`,
    `Fecha y hora: ${formatSlotDateTime(appointment.slotISO)}`,
    `Notas: ${appointment.notes || '-'}`,
  ].join('\n');

const sendAppointmentConfirmation = async (appointment) => {
  if (!isEmailConfigured()) {
    console.warn('[email] Notificaciones deshabilitadas (falta configuración en .env)');
    return;
  }

  const resend = getClient();
  if (!resend) {
    console.warn('[email] Resend no inicializado (API key ausente)');
    return;
  }

  const subject = `Turno confirmado - ${appointment.patientName}`;

  await resend.emails.send({
    from: env.email.from,
    to: appointment.email,
    subject,
    html: formatConfirmationHtml(appointment),
    text: formatConfirmationText(appointment),
  });
};

module.exports = {
  sendAppointmentNotification,
  sendAppointmentCancellation,
  sendAppointmentConfirmation,
};


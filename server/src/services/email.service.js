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

const formatAppointmentHtml = (appointment) => `
  <h1>Nuevo turno solicitado</h1>
  <p><strong>Paciente:</strong> ${appointment.patientName}</p>
  <p><strong>Email:</strong> ${appointment.email}</p>
  <p><strong>Teléfono:</strong> ${appointment.phone}</p>
  <p><strong>Obra social:</strong> ${appointment.insuranceName} (${appointment.insuranceId})</p>
  <p><strong>Fecha y hora (ISO):</strong> ${appointment.slotISO}</p>
  <p><strong>Notas:</strong> ${appointment.notes || '-'}</p>
`;

const formatAppointmentText = (appointment) =>
  [
    'Nuevo turno solicitado',
    `Paciente: ${appointment.patientName}`,
    `Email: ${appointment.email}`,
    `Teléfono: ${appointment.phone}`,
    `Obra social: ${appointment.insuranceName} (${appointment.insuranceId})`,
    `Fecha y hora (ISO): ${appointment.slotISO}`,
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
    // Se envía solo al paciente que registró el turno
    to: appointment.email,
    subject,
    html: formatAppointmentHtml(appointment),
    text: formatAppointmentText(appointment),
  });
};




const formatCancellationHtml = (appointment) => `
  <h1>Tu turno fue cancelado</h1>
  <p><strong>Paciente:</strong> ${appointment.patientName}</p>
  <p><strong>Email:</strong> ${appointment.email}</p>
  <p><strong>Teléfono:</strong> ${appointment.phone}</p>
  <p><strong>Obra social:</strong> ${appointment.insuranceName} (${appointment.insuranceId})</p>
  <p><strong>Fecha y hora (ISO):</strong> ${appointment.slotISO}</p>
  <p><strong>Notas:</strong> ${appointment.notes || '-'}</p>
`;

const formatCancellationText = (appointment) =>
  [
    'Tu turno fue cancelado',
    `Paciente: ${appointment.patientName}`,
    `Email: ${appointment.email}`,
    `Teléfono: ${appointment.phone}`,
    `Obra social: ${appointment.insuranceName} (${appointment.insuranceId})`,
    `Fecha y hora (ISO): ${appointment.slotISO}`,
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
  <p><strong>Paciente:</strong> ${appointment.patientName}</p>
  <p><strong>Email:</strong> ${appointment.email}</p>
  <p><strong>Teléfono:</strong> ${appointment.phone}</p>
  <p><strong>Obra social:</strong> ${appointment.insuranceName} (${appointment.insuranceId})</p>
  <p><strong>Fecha y hora (ISO):</strong> ${appointment.slotISO}</p>
  <p><strong>Notas:</strong> ${appointment.notes || '-'}</p>
`;

const formatConfirmationText = (appointment) =>
  [
    'Tu turno fue confirmado',
    `Paciente: ${appointment.patientName}`,
    `Email: ${appointment.email}`,
    `Teléfono: ${appointment.phone}`,
    `Obra social: ${appointment.insuranceName} (${appointment.insuranceId})`,
    `Fecha y hora (ISO): ${appointment.slotISO}`,
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
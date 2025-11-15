USE ProHealth;

INSERT INTO Insurances (Id, Nombre) VALUES
  ('osde', 'OSDE'),
  ('swiss', 'Swiss Medical'),
  ('galeno', 'Galeno'),
  ('medife', 'Medifé'),
  ('ioma', 'IOMA'),
  ('omint', 'OMINT')
ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre);

INSERT INTO AdminUsers (FullName, Email, PasswordHash)
SELECT 'Administrador ProHealth', 'admin@demo.com', '$2b$10$tE4IJfHKNVw9mFtV4wNYa.MZbTsgmKLqUtnhhyctBmgQDbabtV27u'
WHERE NOT EXISTS (SELECT 1 FROM AdminUsers WHERE Email = 'admin@demo.com');

DELETE FROM Appointments;

INSERT INTO Appointments (PatientName, Phone, Email, InsuranceId, SlotDate, Status)
VALUES
  ('Juan Pérez', '1122334455', 'juanp@example.com', 'osde', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 2 HOUR), 'SOLICITADA'),
  ('María López', '1199887766', 'maria@example.com', 'swiss', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY), 'CONFIRMADA'),
  ('Carlos Rodríguez', '1133557799', 'carlosr@example.com', 'galeno', DATE_ADD(UTC_TIMESTAMP(), INTERVAL 2 DAY), 'SOLICITADA');

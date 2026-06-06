-- seed.sql

-- Insert Departments
INSERT INTO departments (id, name, description) VALUES
('d1111111-1111-1111-1111-111111111111', 'Cardiology', 'Heart and cardiovascular system diseases'),
('d2222222-2222-2222-2222-222222222222', 'General Medicine', 'Primary care and general health issues');

-- Insert Doctors
INSERT INTO doctors (id, name, specialty, license_number, phone, email, department_id) VALUES
('d0c11111-1111-1111-1111-111111111111', 'Dr. Alice Smith', 'Cardiologist', 'LIC-CARDIO-001', '555-0101', 'alice.smith@hospital.com', 'd1111111-1111-1111-1111-111111111111'),
('d0c22222-2222-2222-2222-222222222222', 'Dr. Bob Jones', 'General Practitioner', 'LIC-GEN-002', '555-0102', 'bob.jones@hospital.com', 'd2222222-2222-2222-2222-222222222222'),
('d0c33333-3333-3333-3333-333333333333', 'Dr. Carol White', 'General Practitioner', 'LIC-GEN-003', '555-0103', 'carol.white@hospital.com', 'd2222222-2222-2222-2222-222222222222');

-- Insert Patients
INSERT INTO patients (id, name, date_of_birth, blood_type, gender, phone, email, ssn, insurance_id) VALUES
('ba711111-1111-1111-1111-111111111111', 'John Doe', '1980-05-15', 'O_POSITIVE', 'MALE', '555-0201', 'john.doe@email.com', 'SSN-001', 'INS-1001'),
('ba722222-2222-2222-2222-222222222222', 'Jane Smith', '1992-08-22', 'A_NEGATIVE', 'FEMALE', '555-0202', 'jane.smith@email.com', 'SSN-002', 'INS-1002'),
('ba733333-3333-3333-3333-333333333333', 'Mike Brown', '1975-11-03', 'B_POSITIVE', 'MALE', '555-0203', 'mike.brown@email.com', 'SSN-003', 'INS-1003'),
('ba744444-4444-4444-4444-444444444444', 'Lisa Davis', '2001-01-30', 'AB_POSITIVE', 'FEMALE', '555-0204', 'lisa.davis@email.com', 'SSN-004', 'INS-1004'),
('ba755555-5555-5555-5555-555555555555', 'Tom Wilson', '1965-12-12', 'O_NEGATIVE', 'MALE', '555-0205', 'tom.wilson@email.com', 'SSN-005', 'INS-1005');

-- Insert Users
-- Password for all is Test@1234
INSERT INTO users (id, email, password_hash, role, doctor_id, patient_id) VALUES
(uuid_generate_v4(), 'admin@hospital.com', '$2b$10$mmk.A0ip9K23EKhw6IMT4.Br4zL/5On3lB874Gv1VMoBrbFI7e6Fe', 'ADMIN', NULL, NULL),

(uuid_generate_v4(), 'alice.smith@hospital.com', '$2b$10$mmk.A0ip9K23EKhw6IMT4.Br4zL/5On3lB874Gv1VMoBrbFI7e6Fe', 'DOCTOR', 'd0c11111-1111-1111-1111-111111111111', NULL),
(uuid_generate_v4(), 'bob.jones@hospital.com', '$2b$10$mmk.A0ip9K23EKhw6IMT4.Br4zL/5On3lB874Gv1VMoBrbFI7e6Fe', 'DOCTOR', 'd0c22222-2222-2222-2222-222222222222', NULL),
(uuid_generate_v4(), 'carol.white@hospital.com', '$2b$10$mmk.A0ip9K23EKhw6IMT4.Br4zL/5On3lB874Gv1VMoBrbFI7e6Fe', 'DOCTOR', 'd0c33333-3333-3333-3333-333333333333', NULL),

(uuid_generate_v4(), 'john.doe@email.com', '$2b$10$mmk.A0ip9K23EKhw6IMT4.Br4zL/5On3lB874Gv1VMoBrbFI7e6Fe', 'PATIENT', NULL, 'ba711111-1111-1111-1111-111111111111'),
(uuid_generate_v4(), 'jane.smith@email.com', '$2b$10$mmk.A0ip9K23EKhw6IMT4.Br4zL/5On3lB874Gv1VMoBrbFI7e6Fe', 'PATIENT', NULL, 'ba722222-2222-2222-2222-222222222222');

-- Insert Appointments
INSERT INTO appointments (id, patient_id, doctor_id, scheduled_at, status, notes) VALUES
('a9911111-1111-1111-1111-111111111111', 'ba711111-1111-1111-1111-111111111111', 'd0c11111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days', 'COMPLETED', 'Routine checkup'),
('a9922222-2222-2222-2222-222222222222', 'ba722222-2222-2222-2222-222222222222', 'd0c22222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days', 'COMPLETED', 'Fever and chills'),
('a9933333-3333-3333-3333-333333333333', 'ba733333-3333-3333-3333-333333333333', 'd0c33333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day', 'COMPLETED', 'Annual physical'),
('a9944444-4444-4444-4444-444444444444', 'ba744444-4444-4444-4444-444444444444', 'd0c11111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 hours', 'COMPLETED', 'Chest pain consultation'),
('a9955555-5555-5555-5555-555555555555', 'ba755555-5555-5555-5555-555555555555', 'd0c22222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 hours', 'COMPLETED', 'Back pain'),

(uuid_generate_v4(), 'ba711111-1111-1111-1111-111111111111', 'd0c22222-2222-2222-2222-222222222222', NOW() + INTERVAL '1 hour', 'IN_PROGRESS', 'Follow-up appointment'),
(uuid_generate_v4(), 'ba722222-2222-2222-2222-222222222222', 'd0c33333-3333-3333-3333-333333333333', NOW() + INTERVAL '1 day', 'SCHEDULED', 'Vaccination'),
(uuid_generate_v4(), 'ba733333-3333-3333-3333-333333333333', 'd0c11111-1111-1111-1111-111111111111', NOW() + INTERVAL '2 days', 'SCHEDULED', 'ECG review'),
(uuid_generate_v4(), 'ba744444-4444-4444-4444-444444444444', 'd0c22222-2222-2222-2222-222222222222', NOW() + INTERVAL '3 days', 'SCHEDULED', 'General checkup'),
(uuid_generate_v4(), 'ba755555-5555-5555-5555-555555555555', 'd0c33333-3333-3333-3333-333333333333', NOW() + INTERVAL '4 days', 'SCHEDULED', 'Prescription refill consultation');

-- Insert Prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, medication, dosage, frequency, start_date, end_date, notes) VALUES
('ba711111-1111-1111-1111-111111111111', 'd0c11111-1111-1111-1111-111111111111', 'a9911111-1111-1111-1111-111111111111', 'Lisinopril', '10mg', 'Once daily', CURRENT_DATE - 5, CURRENT_DATE + 25, 'For blood pressure control'),
('ba722222-2222-2222-2222-222222222222', 'd0c22222-2222-2222-2222-222222222222', 'a9922222-2222-2222-2222-222222222222', 'Amoxicillin', '500mg', 'Three times daily', CURRENT_DATE - 2, CURRENT_DATE + 8, 'Take with food'),
('ba733333-3333-3333-3333-333333333333', 'd0c33333-3333-3333-3333-333333333333', 'a9933333-3333-3333-3333-333333333333', 'Vitamin D3', '1000 IU', 'Once daily', CURRENT_DATE - 1, CURRENT_DATE + 30, 'Supplement'),
('ba744444-4444-4444-4444-444444444444', 'd0c11111-1111-1111-1111-111111111111', 'a9944444-4444-4444-4444-444444444444', 'Aspirin', '81mg', 'Once daily', CURRENT_DATE, CURRENT_DATE + 30, 'Preventative'),
('ba755555-5555-5555-5555-555555555555', 'd0c22222-2222-2222-2222-222222222222', 'a9955555-5555-5555-5555-555555555555', 'Ibuprofen', '400mg', 'Every 6 hours as needed', CURRENT_DATE, CURRENT_DATE + 5, 'For pain relief');

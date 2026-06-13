import { Context } from '../../index';

export const typeResolvers = {
  Appointment: {
    patient: (parent: any, _: any, { loaders }: Context) => 
      loaders?.patientLoader.load(parent.patient_id),
    doctor: (parent: any, _: any, { loaders }: Context) => 
      loaders?.doctorLoader.load(parent.doctor_id),
    scheduledAt: (parent: any) => parent.scheduled_at,
    createdAt: (parent: any) => parent.created_at,
    updatedAt: (parent: any) => parent.updated_at,
  },
  Patient: {
    dateOfBirth: (parent: any) => parent.date_of_birth,
    bloodType: (parent: any) => parent.blood_type,
    insuranceId: (parent: any) => parent.insurance_id,
    isActive: (parent: any) => parent.is_active,
    createdAt: (parent: any) => parent.created_at,
    appointments: async (parent: any, _: any, { db }: Context) => {
      const result = await db.query(
        'SELECT * FROM appointments WHERE patient_id = $1 ORDER BY scheduled_at DESC',
        [parent.id]
      );
      return result.rows;
    },
    prescriptions: (parent: any, _: any, { loaders }: Context) => 
      loaders?.prescriptionsByPatientLoader.load(parent.id),
  },
  Doctor: {
    licenseNumber: (parent: any) => parent.license_number,
    isActive: (parent: any) => parent.is_active,
    department: (parent: any, _: any, { loaders }: Context) => 
      parent.department_id ? loaders?.departmentLoader.load(parent.department_id) : null,
    appointments: async (parent: any, _: any, { db }: Context) => {
      const result = await db.query(
        'SELECT * FROM appointments WHERE doctor_id = $1 ORDER BY scheduled_at DESC',
        [parent.id]
      );
      return result.rows;
    },
    prescriptions: async (parent: any, _: any, { db }: Context) => {
      const result = await db.query(
        'SELECT * FROM prescriptions WHERE doctor_id = $1 ORDER BY start_date DESC',
        [parent.id]
      );
      return result.rows;
    },
  },
  Prescription: {
    patient: (parent: any, _: any, { loaders }: Context) => 
      loaders?.patientLoader.load(parent.patient_id),
    doctor: (parent: any, _: any, { loaders }: Context) => 
      loaders?.doctorLoader.load(parent.doctor_id),
    appointment: async (parent: any, _: any, { db }: Context) => {
      if (!parent.appointment_id) return null;
      const result = await db.query('SELECT * FROM appointments WHERE id = $1', [parent.appointment_id]);
      return result.rows[0];
    },
    startDate: (parent: any) => parent.start_date,
    endDate: (parent: any) => parent.end_date,
    createdAt: (parent: any) => parent.created_at,
  },
  Department: {
    doctors: async (parent: any, _: any, { db }: Context) => {
      const result = await db.query('SELECT * FROM doctors WHERE department_id = $1', [parent.id]);
      return result.rows;
    }
  }
};

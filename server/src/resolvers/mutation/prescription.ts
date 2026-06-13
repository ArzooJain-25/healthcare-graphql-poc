import { Context } from '../../index';
import { notFound, mapPgError } from '../../errors';
import { pubsub, NEW_PRESCRIPTION } from '../../pubsub';

export const prescriptionMutationResolvers = {
  createPrescription: async (_: any, { input }: any, { db }: Context) => {
    try {
      const result = await db.query(
        `INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, medication, dosage, frequency, start_date, end_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [input.patientId, input.doctorId, input.appointmentId, input.medication, input.dosage, input.frequency, input.startDate, input.endDate, input.notes]
      );
      const prescription = result.rows[0];

      pubsub.publish(NEW_PRESCRIPTION, {
        newPrescriptionForPatient: prescription
      });

      return prescription;
    } catch (err: any) {
      throw mapPgError(err);
    }
  },
  revokePrescription: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query('DELETE FROM prescriptions WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw notFound('Prescription', id);
    }
    return result.rows[0];
  }
};

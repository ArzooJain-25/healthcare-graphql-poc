import { Context } from '../../index';
import { notFound, mapPgError } from '../../errors';
import { pubsub, NEW_APPOINTMENT, APPOINTMENT_UPDATED } from '../../pubsub';

export const appointmentMutationResolvers = {
  bookAppointment: async (_: any, { input }: any, { db }: Context) => {
    try {
      const result = await db.query(
        `INSERT INTO appointments (patient_id, doctor_id, scheduled_at, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [input.patientId, input.doctorId, input.scheduledAt, input.notes]
      );
      const appointment = result.rows[0];
      
      // Publish event
      pubsub.publish(NEW_APPOINTMENT, {
        newAppointmentForDoctor: appointment
      });

      return appointment;
    } catch (err: any) {
      throw mapPgError(err);
    }
  },
  updateAppointmentStatus: async (_: any, { id, status, notes }: any, { db }: Context) => {
    const fields = ['status = $1', 'updated_at = NOW()'];
    const values: any[] = [status];
    
    if (notes !== undefined) {
      fields.push(`notes = $2`);
      values.push(notes);
    }
    
    values.push(id);
    
    try {
      const result = await db.query(
        `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) throw notFound('Appointment', id);
      const appointment = result.rows[0];

      // Publish event
      pubsub.publish(APPOINTMENT_UPDATED, {
        appointmentStatusChanged: appointment
      });

      return appointment;
    } catch (err: any) {
      throw mapPgError(err);
    }
  },
  cancelAppointment: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query(
      `UPDATE appointments SET status = 'CANCELLED', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      throw notFound('Appointment', id);
    }
    
    const appointment = result.rows[0];
    pubsub.publish(APPOINTMENT_UPDATED, {
      appointmentStatusChanged: appointment
    });

    return appointment;
  }
};

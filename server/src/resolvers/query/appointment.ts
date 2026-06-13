import { Context } from '../../index';
import { notFound } from '../../errors';

export const appointmentQueryResolvers = {
  getAppointment: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query('SELECT * FROM appointments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw notFound('Appointment', id);
    }
    return result.rows[0];
  },
  listAppointments: async (_: any, { patientId, doctorId, status, limit = 20, offset = 0 }: any, { db }: Context) => {
    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];

    if (patientId) {
      params.push(patientId);
      query += ` AND patient_id = $${params.length}`;
    }
    if (doctorId) {
      params.push(doctorId);
      query += ` AND doctor_id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ` ORDER BY scheduled_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }
};

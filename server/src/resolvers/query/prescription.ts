import { Context } from '../../index';
import { notFound } from '../../errors';

export const prescriptionQueryResolvers = {
  getPrescription: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query('SELECT * FROM prescriptions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw notFound('Prescription', id);
    }
    return result.rows[0];
  },
  listPrescriptions: async (_: any, { patientId, limit = 20, offset = 0 }: any, { db }: Context) => {
    const result = await db.query(
      'SELECT * FROM prescriptions WHERE patient_id = $1 ORDER BY start_date DESC LIMIT $2 OFFSET $3',
      [patientId, limit, offset]
    );
    return result.rows;
  }
};

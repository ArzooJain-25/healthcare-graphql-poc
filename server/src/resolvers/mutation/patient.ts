import { Context } from '../../index';
import { notFound, mapPgError } from '../../errors';

export const patientMutationResolvers = {
  createPatient: async (_: any, { input }: any, { db }: Context) => {
    try {
      const result = await db.query(
        `INSERT INTO patients (name, date_of_birth, blood_type, gender, phone, email, ssn, insurance_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [input.name, input.dateOfBirth, input.bloodType, input.gender, input.phone, input.email, input.ssn, input.insuranceId]
      );
      return result.rows[0];
    } catch (err: any) {
      throw mapPgError(err);
    }
  },
  updatePatient: async (_: any, { id, input }: any, { db }: Context) => {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
    if (input.phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(input.phone); }
    if (input.email !== undefined) { fields.push(`email = $${idx++}`); values.push(input.email); }
    if (input.insuranceId !== undefined) { fields.push(`insurance_id = $${idx++}`); values.push(input.insuranceId); }
    if (input.isActive !== undefined) { fields.push(`is_active = $${idx++}`); values.push(input.isActive); }

    if (fields.length === 0) {
      const existing = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
      if (existing.rows.length === 0) throw notFound('Patient', id);
      return existing.rows[0];
    }

    values.push(id);
    const query = `UPDATE patients SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    
    try {
      const result = await db.query(query, values);
      if (result.rows.length === 0) throw notFound('Patient', id);
      return result.rows[0];
    } catch (err: any) {
      throw mapPgError(err);
    }
  },
  deactivatePatient: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query(
      'UPDATE patients SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      throw notFound('Patient', id);
    }
    return result.rows[0];
  }
};

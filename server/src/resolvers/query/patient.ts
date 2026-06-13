import { Context } from '../../index';
import { notFound } from '../../errors';

export const patientQueryResolvers = {
  getPatient: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw notFound('Patient', id);
    }
    return result.rows[0];
  },
  listPatients: async (_: any, { limit = 20, offset = 0 }: { limit?: number; offset?: number }, { db }: Context) => {
    const result = await db.query(
      'SELECT * FROM patients ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },
  searchPatients: async (_: any, { term }: { term: string }, { db }: Context) => {
    const searchPattern = `%${term}%`;
    const result = await db.query(
      'SELECT * FROM patients WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY name ASC',
      [searchPattern]
    );
    return result.rows;
  }
};

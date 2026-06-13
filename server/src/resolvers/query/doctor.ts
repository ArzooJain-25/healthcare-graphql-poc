import { Context } from '../../index';
import { notFound } from '../../errors';

export const doctorQueryResolvers = {
  getDoctor: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query('SELECT * FROM doctors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw notFound('Doctor', id);
    }
    return result.rows[0];
  },
  listDoctors: async (_: any, { specialty, limit = 20, offset = 0 }: { specialty?: string; limit?: number; offset?: number }, { db }: Context) => {
    let query = 'SELECT * FROM doctors';
    const params: any[] = [];
    
    if (specialty) {
      params.push(specialty);
      query += ` WHERE specialty = $${params.length}`;
    }
    
    query += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    return result.rows;
  },
  getDepartment: async (_: any, { id }: { id: string }, { db }: Context) => {
    const result = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw notFound('Department', id);
    }
    return result.rows[0];
  },
  listDepartments: async (_: any, __: any, { db }: Context) => {
    const result = await db.query('SELECT * FROM departments ORDER BY name ASC');
    return result.rows;
  }
};

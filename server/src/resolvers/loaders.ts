import DataLoader from 'dataloader';
import { Pool } from 'pg';

//The loaders are instantiated per-request and attached to the Apollo context

export interface Loaders {
  doctorLoader: DataLoader<string, any>;//Batches lookup of doctors by uuid
  patientLoader: DataLoader<string, any>;//Batches lookup of patients by uuid
  departmentLoader: DataLoader<string, any>;//Batches lookup of departments by uuid
  prescriptionsByPatientLoader: DataLoader<string, any[]>;//Batches lookup of prescriptions by patient_id
}

export function createLoaders(db: Pool): Loaders {
  return {
    doctorLoader: new DataLoader(async (keys: readonly string[]) => {
      const result = await db.query(
        'SELECT * FROM doctors WHERE id = ANY($1::uuid[])',
        [keys]
      );
      
      const lookup = new Map();
      result.rows.forEach(row => {
        lookup.set(row.id, row);
      });
      
      return keys.map(key => lookup.get(key) || null);
    }),

    patientLoader: new DataLoader(async (keys: readonly string[]) => {
      const result = await db.query(
        'SELECT * FROM patients WHERE id = ANY($1::uuid[])',
        [keys]
      );

      const lookup = new Map();
      result.rows.forEach(row => {
        lookup.set(row.id, row);
      });

      return keys.map(key => lookup.get(key) || null);
    }),

    departmentLoader: new DataLoader(async (keys: readonly string[]) => {
      const result = await db.query(
        'SELECT * FROM departments WHERE id = ANY($1::uuid[])',
        [keys]
      );

      const lookup = new Map();
      result.rows.forEach(row => {
        lookup.set(row.id, row);
      });

      return keys.map(key => lookup.get(key) || null);
    }),

    prescriptionsByPatientLoader: new DataLoader(async (keys: readonly string[]) => {
      const result = await db.query(
        'SELECT * FROM prescriptions WHERE patient_id = ANY($1::uuid[])',
        [keys]
      );

      const lookup = new Map<string, any[]>();
      keys.forEach(key => lookup.set(key, [])); // Initialize arrays

      result.rows.forEach(row => {
        const list = lookup.get(row.patient_id);
        if (list) {
          list.push(row);
        }
      });

      return keys.map(key => lookup.get(key) || []);
    })
  };
}

import { mergeTypeDefs } from '@graphql-tools/merge';
import { readFileSync } from 'fs';
import { join } from 'path';

const schemaFiles = [
  'patient.graphql',
  'doctor.graphql',
  'appointment.graphql',
  'prescription.graphql',
  'auth.graphql'
];

const typesArray = schemaFiles.map((file) =>
  readFileSync(join(__dirname, file), { encoding: 'utf8' })
);

export const typeDefs = mergeTypeDefs(typesArray);

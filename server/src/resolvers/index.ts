import { mergeResolvers } from '@graphql-tools/merge';

import { patientQueryResolvers } from './query/patient';
import { doctorQueryResolvers } from './query/doctor';
import { appointmentQueryResolvers } from './query/appointment';
import { prescriptionQueryResolvers } from './query/prescription';

import { patientMutationResolvers } from './mutation/patient';
import { appointmentMutationResolvers } from './mutation/appointment';
import { prescriptionMutationResolvers } from './mutation/prescription';

import { appointmentSubscriptionResolvers } from './subscription/appointment';
import { prescriptionSubscriptionResolvers } from './subscription/prescription';

import { typeResolvers } from './type';

export const resolvers = mergeResolvers([
  {
    Query: {
      ...patientQueryResolvers,
      ...doctorQueryResolvers,
      ...appointmentQueryResolvers,
      ...prescriptionQueryResolvers,
    },
    Mutation: {
      ...patientMutationResolvers,
      ...appointmentMutationResolvers,
      ...prescriptionMutationResolvers,
    },
    Subscription: {
      ...appointmentSubscriptionResolvers,
      ...prescriptionSubscriptionResolvers,
    }
  },
  typeResolvers
]);

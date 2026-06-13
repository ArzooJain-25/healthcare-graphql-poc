import { withFilter } from 'graphql-subscriptions';
import { pubsub, NEW_PRESCRIPTION } from '../../pubsub';

export const prescriptionSubscriptionResolvers = {
  newPrescriptionForPatient: {
    subscribe: withFilter(
      () => pubsub.asyncIterator([NEW_PRESCRIPTION]),
      (payload, variables) => {
        return payload.newPrescriptionForPatient.patient_id === variables.patientId;
      }
    )
  }
};

import { withFilter } from 'graphql-subscriptions';
import { pubsub, APPOINTMENT_UPDATED, NEW_APPOINTMENT } from '../../pubsub';

export const appointmentSubscriptionResolvers = {
  appointmentStatusChanged: {
    subscribe: withFilter(
      () => pubsub.asyncIterator([APPOINTMENT_UPDATED]),
      (payload, variables) => {
        return payload.appointmentStatusChanged.patient_id === variables.patientId;
      }
    )
  },
  newAppointmentForDoctor: {
    subscribe: withFilter(
      () => pubsub.asyncIterator([NEW_APPOINTMENT]),
      (payload, variables) => {
        return payload.newAppointmentForDoctor.doctor_id === variables.doctorId;
      }
    )
  }
};

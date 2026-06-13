import { PubSub } from 'graphql-subscriptions';

//PubSub instance attached to context, used to publish events
export const pubsub = new PubSub();

//Constants used when publishing events, these are also used by @withFilter in subscription resolvers
export const APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED';
export const NEW_APPOINTMENT = 'NEW_APPOINTMENT';
export const NEW_PRESCRIPTION = 'NEW_PRESCRIPTION';

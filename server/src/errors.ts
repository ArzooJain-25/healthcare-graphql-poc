import { GraphQLError } from 'graphql';

//Custom GraphQL errors, extend GraphQLError for proper error handling and debugging

export function notFound(entity: string, id: string): GraphQLError {
  return new GraphQLError(`${entity} with id ${id} not found`, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
}

export function validationError(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  });
}

export function unauthorised(): GraphQLError {
  return new GraphQLError('Unauthorised', {
    extensions: {
      code: 'UNAUTHORISED',
    },
  });
}

export function forbidden(): GraphQLError {
  return new GraphQLError('Forbidden', {
    extensions: {
      code: 'FORBIDDEN',
    },
  });
}

export function mapPgError(err: any): GraphQLError {
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        return new GraphQLError('Already exists', {
          extensions: { code: 'BAD_USER_INPUT', originalError: err.message },
        });
      case '23503': // foreign_key_violation
        return new GraphQLError('Referenced record not found', {
          extensions: { code: 'BAD_USER_INPUT', originalError: err.message },
        });
      case '22P02': // invalid_text_representation (like invalid UUID)
        return new GraphQLError('Invalid ID format', {
          extensions: { code: 'BAD_USER_INPUT', originalError: err.message },
        });
    }
  }
  
  // Return generic error for unexpected errors
  return new GraphQLError('Internal Server Error', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}

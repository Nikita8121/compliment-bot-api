export const ERRORS = {
  FORBIDDEN_API: { code: 'A011', message: 'Access denied', httpCode: 403 },

  //USER
  USER_FETCH_FAILED: {
    code: 'U002',
    message: 'Error when retrieving a user',
    httpCode: 500,
  },
  USER_NOT_UPDATED: {
    code: 'U003',
    message: 'Failed to update user',
    httpCode: 500,
  },
  NO_USER: { code: 'U004', message: 'User not found', httpCode: 404 },
  USER_NOT_ACTIVATED: {
    code: 'U005',
    message: 'Account has not been activated',
    httpCode: 403,
  },
  USER_ALREADY_EXISTS: {
    code: 'U006',
    message: 'User with this email already exists',
    httpCode: 409,
  },
  USER_NOT_FOUND: {
    code: 'U007',
    message: 'User with this email not found',
    httpCode: 404,
  },
  USER_CREATE_FAILED: {
    code: 'U008',
    message: 'Failed to create user',
    httpCode: 500,
  },
  USER_UPDATE_FAILED: {
    code: 'U009',
    message: 'Failed to update user',
    httpCode: 400,
  },
  USER_LIST_FETCH_FAILED: {
    code: 'U010',
    message: 'Failed fetching user list',
    httpCode: 500,
  },
} as const;

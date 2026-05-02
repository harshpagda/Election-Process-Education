export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
};

export const MESSAGES = {
  SUCCESS: "Operation successful",
  ERROR: "An error occurred",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
};

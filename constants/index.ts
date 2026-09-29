/**
 * Application Constants
 */
export const APP_CONSTANTS = {
  APP_NAME: "AI-Native Software Engineering Academy",
  API_VERSION: "v1",
  DEFAULT_LOCALE: "en",
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,
} as const;

/**
 * Storage Keys (LocalStorage, SessionStorage, Cookies)
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "academy_auth_token",
  THEME: "academy_theme",
  ACTIVE_STAGE: "academy_active_stage",
  SIDEBAR_STATE: "academy_sidebar_collapsed",
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

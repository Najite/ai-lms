import { HTTP_STATUS } from "@/constants";

/**
 * Base Application Error
 */
export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, isOperational = true, details?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      isOperational: this.isOperational,
      details: this.details,
    };
  }
}

/**
 * Domain & Business Logic Error
 */
export class DomainError extends AppError {
  public readonly statusCode = HTTP_STATUS.BAD_REQUEST;
  public readonly errorCode = "DOMAIN_ERROR";

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, true, details);
  }
}

/**
 * Schema Validation Error
 */
export class ValidationError extends AppError {
  public readonly statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
  public readonly errorCode = "VALIDATION_ERROR";

  constructor(message = "Validation Error", details?: Record<string, string[]>) {
    super(message, true, details);
  }
}

/**
 * Entity Not Found Error
 */
export class NotFoundError extends AppError {
  public readonly statusCode = HTTP_STATUS.NOT_FOUND;
  public readonly errorCode = "NOT_FOUND";

  constructor(entity = "Resource", identifier?: string | number) {
    super(
      identifier ? `${entity} with identifier '${identifier}' was not found.` : `${entity} was not found.`,
      true
    );
  }
}

/**
 * Authentication Required Error
 */
export class UnauthorizedError extends AppError {
  public readonly statusCode = HTTP_STATUS.UNAUTHORIZED;
  public readonly errorCode = "UNAUTHORIZED";

  constructor(message = "Authentication is required to access this resource.") {
    super(message, true);
  }
}

/**
 * Authorization Forbidden Error
 */
export class ForbiddenError extends AppError {
  public readonly statusCode = HTTP_STATUS.FORBIDDEN;
  public readonly errorCode = "FORBIDDEN";

  constructor(message = "You do not have permission to perform this action.") {
    super(message, true);
  }
}

/**
 * Resource Conflict Error
 */
export class ConflictError extends AppError {
  public readonly statusCode = HTTP_STATUS.CONFLICT;
  public readonly errorCode = "CONFLICT";

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, true, details);
  }
}

/**
 * Internal Server Error
 */
export class InternalServerError extends AppError {
  public readonly statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  public readonly errorCode = "INTERNAL_SERVER_ERROR";

  constructor(message = "An unexpected internal server error occurred.", details?: Record<string, unknown>) {
    super(message, false, details);
  }
}

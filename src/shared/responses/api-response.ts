// src/common/responses/api-response.ts
import { SuccessResponse } from './success.response';
import { PaginatedResponse } from './paginated.response';
import { ErrorResponse, ErrorDetail } from './error.response';

export class ApiResponse {
  // Success responses
  static success<T>(
    data: T,
    message?: string,
    statusCode?: number,
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): SuccessResponse<T> {
    return new SuccessResponse<T>(data, message, statusCode, options);
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): SuccessResponse<T> {
    return new SuccessResponse<T>(data, message, 201, options);
  }

  static ok<T>(
    data: T,
    message: string = 'Request successful',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): SuccessResponse<T> {
    return new SuccessResponse<T>(data, message, 200, options);
  }

  static noContent(
    message: string = 'No content',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): SuccessResponse<null> {
    return new SuccessResponse<null>(null, message, 204, options);
  }

  // Paginated response
  static paginated<T>(
    items: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message?: string,
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): PaginatedResponse<T> {
    return new PaginatedResponse<T>(items, pagination, message, options);
  }

  // Error responses (delegate to ErrorResponse static methods)
  static badRequest(
    message?: string,
    details?: ErrorDetail[],
    options?: { path?: string; requestId?: string; version?: string },
  ): ErrorResponse {
    return ErrorResponse.badRequest(message, details, options);
  }

  static unauthorized(
    message?: string,
    options?: { path?: string; requestId?: string; version?: string },
  ): ErrorResponse {
    return ErrorResponse.unauthorized(message, options);
  }

  static forbidden(message?: string, options?: { path?: string; requestId?: string; version?: string }): ErrorResponse {
    return ErrorResponse.forbidden(message, options);
  }

  static notFound(message?: string, options?: { path?: string; requestId?: string; version?: string }): ErrorResponse {
    return ErrorResponse.notFound(message, options);
  }

  static validationError(
    details: ErrorDetail[],
    message?: string,
    options?: { path?: string; requestId?: string; version?: string },
  ): ErrorResponse {
    return ErrorResponse.validationError(details, message, options);
  }

  static internal(
    message?: string,
    options?: { path?: string; requestId?: string; version?: string; includeStack?: boolean },
  ): ErrorResponse {
    return ErrorResponse.internal(message, options);
  }

  // Custom error
  static error(
    message: string,
    errorCode: string,
    statusCode: number,
    details?: ErrorDetail[],
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
      includeStack?: boolean;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, errorCode, statusCode, details, options);
  }
}

// src/common/responses/error.response.ts
import { BaseResponse } from './base.response';

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ErrorData {
  code: string;
  message: string;
  details?: ErrorDetail[];
  stack?: string;
}

export class ErrorResponse extends BaseResponse<ErrorData> {
  constructor(
    message: string,
    errorCode: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: ErrorDetail[],
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
      includeStack?: boolean;
    },
  ) {
    const errorData: ErrorData = {
      code: errorCode,
      message,
      details,
    };

    // Chỉ include stack trace trong môi trường development
    if (options?.includeStack && process.env.NODE_ENV !== 'production') {
      errorData.stack = new Error().stack;
    }

    super(false, message, errorData, statusCode, options);
  }

  // Factory methods cho các lỗi phổ biến
  static badRequest(
    message: string = 'Bad Request',
    details?: ErrorDetail[],
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, 'BAD_REQUEST', 400, details, options);
  }

  static unauthorized(
    message: string = 'Unauthorized',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, 'UNAUTHORIZED', 401, undefined, options);
  }

  static forbidden(
    message: string = 'Forbidden',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, 'FORBIDDEN', 403, undefined, options);
  }

  static notFound(
    message: string = 'Not Found',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, 'NOT_FOUND', 404, undefined, options);
  }

  static validationError(
    details: ErrorDetail[],
    message: string = 'Validation Error',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, 'VALIDATION_ERROR', 422, details, options);
  }

  static internal(
    message: string = 'Internal Server Error',
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
      includeStack?: boolean;
    },
  ): ErrorResponse {
    return new ErrorResponse(message, 'INTERNAL_ERROR', 500, undefined, options);
  }
}

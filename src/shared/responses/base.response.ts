// src/common/responses/base.response.ts
export abstract class BaseResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly timestamp: string;
  readonly path?: string;
  readonly statusCode: number;
  readonly requestId?: string;
  readonly version?: string;

  constructor(
    success: boolean,
    message: string,
    data: T,
    statusCode: number,
    options?: {
      path?: string;
      requestId?: string;
      version?: string;
    },
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = options?.path;
    this.requestId = options?.requestId;
    this.version = options?.version || '1.0';
  }
}

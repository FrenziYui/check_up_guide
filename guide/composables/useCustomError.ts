export class CustomError extends Error {
  code: string;
  details?: string;

  constructor(message: string, code: string, details?: string) {
    super(message);
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export const useCustomError = (message: string, code: string, details?: string): CustomError => {
  return new CustomError(message, code, details);
};

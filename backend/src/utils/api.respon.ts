/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export class ApiResponse {
    static success(message: string, data: any = null) {
      return {
        status: 'success',
        message,
        data,
      };
    }
  
    static error(message: string, statusCode: number = 400) {
      return {
        status: 'error',
        message,
        statusCode,
      };
    }
  }
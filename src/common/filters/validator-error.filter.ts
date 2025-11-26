import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus();
    const message = exception.getResponse().message[0];

    response.status(status).json({
      success: false,
      error: {
        code: exception.code,
        name: exception.constructor.name,
        message,
        details: exception.details || null,
      },
      data: null,
    });
  }
}
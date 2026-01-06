import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class AllUnexpectedExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {

    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const lang = ctx.getRequest().headers['accept-language'] || 'uz';

    const messages = {
      'uz': 'Vooy, Server ishlamay qoldi(',
      'ru': 'Сервер не работает',
      'en': 'Mother fuck, server is not working now',
    };

    const message = 
      messages[lang] ||
      messages['uz'];

    response.status(status).json({
      success: false,
      error: {
        code: 505,
        name: 'InternalServerError',
        message,
        details: exception.details || null,
      },
      data: null,
    })
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class AllUnexpectedExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // 1. Haqiqiy status kodini aniqlash
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const lang = request.headers['accept-language'] || 'uz';

    const messages = {
      'uz': 'Kechirasiz, xatolik yuz berdi',
      'ru': 'Произошла ошибка',
      'en': 'Internal server error',
    };

    // 2. Agar xato 404 bo'lsa, maxsus xabar yuborish (ixtiyoriy)
    let message = messages[lang] || messages['uz'];
    
    if (status === HttpStatus.NOT_FOUND) {
        message = lang === 'en' ? 'Page not found' : 'Sahifa topilmadi';
    }

    // Konsolga xatoni chiqarish (faqat 500 xatolar bo'lsa yaxshi)
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        console.error(exception);
    }

    response.status(status).json({
      success: false,
      error: {
        code: status, // 505 emas, haqiqiy statusni yuboring
        name: exception.name || 'Error',
        message: message,
        details: exception.response?.message || exception.message || null,
      },
      data: null,
    });
  }
}
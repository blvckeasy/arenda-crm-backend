// BaseErrorFilter.ts

import { BaseError } from "@blvckeasy/arenda-crm-core";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch(BaseError)
export class BaseErrorFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    try {
      // Barcha logikani shu yerga joylashtiring
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const status = HttpStatus.BAD_REQUEST;
      
      // Ehtimoliy xavfli joy:
      // Agar bu HTTP konteksti bo'lmasa, getRequest() yoki .headers xatolik beradi
      const request = ctx.getRequest();
      const lang = request.headers?.['accept-language'] || 'uz'; // <-- Xavfsizlik uchun '?' qo'shing

      const message =
        exception.translates?.[lang] ||
        exception.translates?.uz ||
        exception.message;

      response.status(status).json({
        success: false,
        error: {
          code: exception.code, // <-- 'code' xususiyati mavjudligiga ishonch hosil qiling
          name: exception.constructor.name,
          message,
          details: exception.details || null,
        },
        data: null,
      });

    } catch (error) {
      // Agar BaseErrorFilter'ning o'zi ishdan chiqsa, bu yerda log ko'rinadi
      console.error('!!! XATOLIK BaseErrorFilter ICHIDA YUZ BERDI:', error);
      console.error('!!! ASL XATOLIK:', exception); // Bu asl TokenError

      // Filtrning o'zi xatoga uchrasa, xavfsiz javob qaytarish
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
          code: 500,
          name: 'FilterProcessingError',
          message: 'Error filter failed to process the request.',
        },
        data: null,
      });
    }
  }
}
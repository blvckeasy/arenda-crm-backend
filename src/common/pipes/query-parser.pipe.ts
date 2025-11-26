// parse-query.pipe.ts
import { PipeTransform, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  constructor(private readonly dtoMap: Record<string, any>) {}

  transform(value: any) {
    const result: Record<string, any> = {};

    for (const [key, DtoClass] of Object.entries(this.dtoMap)) {
      // DTO ichidagi property nomlarini olish
      const dtoProps = Object.keys(new DtoClass());
      // Query'dan faqat shu property'larni olish
      let filtered = Object.fromEntries(
        Object.entries(value).filter(([prop]) => dtoProps.includes(prop)),
      );
      // Instance yaratish
      result[key] = plainToInstance(DtoClass, filtered, {
        enableImplicitConversion: true,
      });
    }
    return result;
  }
}
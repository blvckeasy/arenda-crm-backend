import { Injectable } from "@nestjs/common";
import { IncludeQueryParamDto } from "../dto";

@Injectable()
export class RequestQueryBuilder {
  buildIncludeParam (str: IncludeQueryParamDto) {
    if (!str.include) return;

    const built = Object.assign(
      {},
      ...str.include.split(',').map((e) => {

        const nestedInclude = e.split(">");
        if (nestedInclude.length > 1) {
          let q = {};

          for (let i = nestedInclude.length - 1; i >= 0; i--) {
            if (i == nestedInclude.length - 1) {
              q = { [nestedInclude[i]]: true };
            } else {
              q = {
                [nestedInclude[i]]: {
                  include: q
                }
              }
            }
          }

          return q;
        }

        return { [e]: true };
      }),
    );

    return built;
  }
}
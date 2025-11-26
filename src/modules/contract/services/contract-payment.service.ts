import { ContractPaymentError, ContractPayment, CoreContractPaymentService, Pagination, Prisma, Sort, ErrorCodeEnum } from "@blvckeasy/arenda-crm-core";
import { Injectable } from "@nestjs/common";
import { FilterByIdDto } from "../../../common";

@Injectable()
export class ContractPaymentService {
  constructor (
    private readonly coreContractPaymentService: CoreContractPaymentService,
  ) {}

  async getById(filter: FilterByIdDto): Promise<ContractPayment> {
    const found = await this.coreContractPaymentService.getByUnique(filter);
    if (!found) {
      throw new ContractPaymentError(ErrorCodeEnum.NOT_FOUND);
    }
    return found;
  }

  async create (body: Prisma.ContractPaymentCreateInput) {
    const newPayment = await this.coreContractPaymentService.create(body);
    return newPayment;
  }

  async update (id: number, body: Prisma.ContractPaymentUpdateInput) {
    const updated = await this.coreContractPaymentService.update(id, body);
    return updated;
  }

  async list(filter?: Prisma.ContractPaymentWhereInput, pagination?: Pagination, sort?: Sort) {
    const found = await this.coreContractPaymentService.list(pagination, filter, sort);
    return found;
  }
}

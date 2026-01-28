import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class PayWithAmountDto {
    @IsNumber()
    @IsNotEmpty()
    paidAmount: number;

    @IsDateString()
    @IsNotEmpty()
    paidDate: Date;
}
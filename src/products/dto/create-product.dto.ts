import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    // userId: string; from the 

    //All fields are required
}
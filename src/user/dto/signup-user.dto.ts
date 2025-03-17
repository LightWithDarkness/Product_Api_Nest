import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupUserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}
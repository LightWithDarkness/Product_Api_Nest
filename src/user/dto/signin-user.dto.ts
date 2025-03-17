import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SigninUserDto{
    @IsEmail()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string
}
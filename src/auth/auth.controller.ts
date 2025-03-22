import { Body, Controller, Post, UsePipes, ValidationPipe, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async signUp(@Body() user: SignupUserDto) {
        return await  this.authService.signUp(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async signIn(@Body() user: SigninUserDto) {
        return await this.authService.signIn(user);
    }
}

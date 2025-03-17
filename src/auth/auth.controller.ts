import { Body, Controller, Post, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async signUp(@Body() user: SignupUserDto) {
        return this.authService.signUp(user);
    }

    @Post('signin')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async signIn(@Body() user: SigninUserDto) {
        return this.authService.signIn(user);
    }
}

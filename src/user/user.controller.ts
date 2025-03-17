import { Body, Controller, Post, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly authService: UserService) { }

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

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private jwtService:JwtService ,@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async signUp(user: SignupUserDto) {
        try {
            const { name, email, password } = user;
            
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }

            const passwordHash = await bcrypt.hash(password, 12);
            const newUser = new this.userModel({ name, email, password: passwordHash });
            await newUser.save();

            const { password: _, ...userWithoutPassword } = newUser.toObject();
            return { message: 'User created successfully', user: userWithoutPassword };
        } catch (error) {
            this.handleError(error, 'signUp');
        }
    }

    async signIn(user: SigninUserDto): Promise<{accessToken: string}> {
        try {
            const { email, password } = user;
            const existingUser = await this.userModel.findOne({ email });

            if (!existingUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }

            // const { password: _, ...userWithoutPassword } = existingUser.toObject();
            // return { message: 'User signed in successfully', user: userWithoutPassword };

            console.log('existingUser',existingUser);
            const payload = {sub: existingUser._id, email: existingUser.email};
            return {accessToken:  await this.jwtService.signAsync(payload)};
        } catch (error) {
            this.handleError(error, 'signIn');
        }
    }

    private handleError(error: any, methodName: string): never {
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal Server Error';

        // this.logger.error(`Error in ${methodName}: ${message} (Status: ${status})`);
        throw new HttpException(message, status);
    }
}

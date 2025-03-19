import { CanActivate, Injectable, UnauthorizedException, ExecutionContext, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constant";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }


    async canActivate(context: ExecutionContext):Promise<boolean>{  // can also use ->boolean | Promise<boolean> | Observable<boolean> 
        const request = context.switchToHttp().getRequest<Request>();

        const token = this.extractTokenFromRequest(request);
        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret || 'secretKey'});
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized');
        }
        return true;
    }

    extractTokenFromRequest(request: Request): string | undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}




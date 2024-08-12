import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from './user.service'; // Import your user service
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your_jwt_secret', // Ensure this matches the secret used to sign the JWT
        });
    }

    async validate(payload: JwtPayload) {
        console.log(payload)
        const user = await this.userService.findOneByusername(payload.username);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

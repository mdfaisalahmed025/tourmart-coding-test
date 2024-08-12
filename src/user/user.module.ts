import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UmrahPackage } from './entities/umrah.entity';
import { Booking } from './entities/booking.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { AbilityFactory } from './ability.factor';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './policy.guard';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([User, UmrahPackage, Booking,

  ]),
  JwtModule.register({
    secret: 'yourSecretKey', // Ensure you have a secret key
    signOptions: { expiresIn: '60m' }, // Token expiry time
  }),
  CacheModule.register({
    isGlobal: true,
    ttl: 1000, // Default TTL in seconds
    max: 1000, // Maximum number of items in cache
  }),

  ],


  controllers: [UserController],
  providers: [UserService,
    JwtStrategy, JwtAuthGuard,
    AbilityFactory,
    //  {
    // provide: APP_GUARD,
    // useClass: PoliciesGuard,
    // },
  ],
  exports: [JwtAuthGuard],
})
export class UserModule { }

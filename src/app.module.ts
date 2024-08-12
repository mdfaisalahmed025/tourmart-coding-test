import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UmrahPackage } from './user/entities/umrah.entity';
import { Booking } from './user/entities/booking.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './user/policy.guard';
import { AbilityFactory } from './user/ability.factor';
import { Token } from './user/entity.token';
import { FlatESLint } from 'eslint/use-at-your-own-risk';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    username: 'root',
    password: '',
    host: 'localhost',
    database: 'tourmartlimited',
    port: 3306,
    entities: [
      User, UmrahPackage, Booking, Token
    ],
    synchronize: false,
  }),

  CacheModule.register({
    // Redis server host // Redis server port
    ttl: 1000, // Default TTL in seconds
    max: 10000, // Maximum number of items in cache
  }),
    UserModule
  ],

  controllers: [AppController],
  providers: [AppService,


    // AbilityFactory,
    //  {
    //   provide: APP_GUARD,
    //   useClass: PoliciesGuard
    // },


  ],
})
export class AppModule { }

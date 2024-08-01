import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UmrahPackage } from './user/entities/umrah.entity';
import { Booking } from './user/entities/booking.entity';
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
      User, UmrahPackage, Booking
    ],
    synchronize: true,
  }),
    UserModule
  ],

  // CacheModule.register({
  //   ttl: 60, // seconds, time-to-live for cache
  //   max: 10, // maximum number of items in cache
  // }),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

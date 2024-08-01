import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UmrahPackage } from './entities/umrah.entity';
import { Booking } from './entities/booking.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([User, UmrahPackage, Booking])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }

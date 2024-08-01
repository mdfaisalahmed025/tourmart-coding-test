import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { UmrahPackage } from './entities/umrah.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(UmrahPackage) private umrahPackageRepository: Repository<UmrahPackage>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }




  async search(username: string) {
    console.log('Start search.........');

    try {
      //Check cache first
      const cachedResult = await this.cacheManager.get(username);
      if (cachedResult) {
        console.log('Returning cached result');
        return cachedResult;
      }

      // Perform database query
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.bookings', 'booking')
        .leftJoinAndSelect('booking.umrahPackage', 'umrahPackage')
        .where('user.username LIKE :username', { username: `%${username}%` }) // Use LIKE for filtering
        .getMany();

      // console.log('Users found:', users);

      //Cache the result
      await this.cacheManager.set(username, users, 60); // Cache for 60 seconds

      return users;
    } catch (error) {
      console.error('Error occurred during search:', error);
      throw new Error('Unable to perform search');
    }
  }

}

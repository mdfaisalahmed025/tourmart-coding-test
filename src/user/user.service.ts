import { Inject, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
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

  async search(username: any) {
    console.log('Start search.........');
    try {
      // Check cache first
      const cacheKey = `user-bookings-${username}`;
      const cachedResult = await this.cacheManager.get(cacheKey);
      if (cachedResult) {
        console.log('Returning cached result:', cachedResult);
        return cachedResult;
      }

      console.log('Cache miss, querying database...');

      // Perform database query
      const bookingDetails = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.bookings', 'booking')
        .leftJoinAndSelect('booking.umrahPackage', 'umrahPackage')
        .where('user.username LIKE :username', { username: `%${username}%` })
        .getMany();

      // console.log('Users found:', bookingDetails);

      // Cache the result
      await this.cacheManager.set(cacheKey, bookingDetails, 1000); // Cache for 1000 seconds
      console.log("Cached the result with key:", cacheKey);

      return bookingDetails;
    } catch (error) {
      console.error('Error occurred during search:', error);
      throw new Error('Unable to perform search');
    }
  }
}

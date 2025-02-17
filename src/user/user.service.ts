import { Inject, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity';
import { UmrahPackage } from './entities/umrah.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Role } from './roles.enum';
@Injectable()
export class UserService {
  findOne(arg0: number, user: any) {
    throw new Error('Method not implemented.');
  }
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

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findOneByusername(username);
    if (user && user.password === password) { // In practice, use hashed passwords
      return user;
    }
    return null;
  }


  async registerUser(
    name: string,
    username: string,
    email: string,
    contactNumber: string,
    password: string,
    role: Role = Role.USER, // Default role is USER
  ): Promise<User> {
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.contactNumber = contactNumber;
    user.password = password;
    user.role = role;

    return await this.userRepository.save(user);
  }

  async findOneByusername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAlluser(): Promise<User[] | undefined> {
    return this.userRepository.find({ where: {} })
  }

  async findAllPackages(): Promise<UmrahPackage[] | undefined> {
    return this.umrahPackageRepository.find({ where: {} })
  }

  async createUmrahPackage(
    name: string,
    packageName: string,
    totalDuration: string,
    price: number,
  ): Promise<UmrahPackage> {
    const umrahPackage = new UmrahPackage();
    umrahPackage.name = name;
    umrahPackage.packageName = packageName;
    umrahPackage.totalDuration = totalDuration;
    umrahPackage.price = price;

    return await this.umrahPackageRepository.save(umrahPackage);
  }



  // Methods for role-based access control
  async hasRole(user: User, role: Role): Promise<boolean> {
    return user.role === role;
  }

  async isAdmin(username: string): Promise<boolean> {
    const user = await this.findOneByusername(username);
    return user.role === Role.ADMIN;
  }

  async isEditor(username: string): Promise<boolean> {
    const user = await this.findOneByusername(username);
    return user.role === Role.EDITOR;
  }

  async isGeneralUser(username: string): Promise<boolean> {
    const user = await this.findOneByusername(username);
    return user.role === Role.USER;
  }


  async getAllbooking() {
    const data = await this.bookingRepository.find({})
    return data
  }


}

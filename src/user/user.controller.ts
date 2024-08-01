import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('booking')
  async search(@Body('username') username: string) {
    console.log('Search endpoint hit with query:', username);
    const results = await this.userService.search(username);
    console.log('Search results:', results);
    return results;
  }


}

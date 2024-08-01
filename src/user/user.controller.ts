import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('booking')
  async search(@Query('username') username: any) {
    console.log('Search endpoint hit with query:', username);
    const results = await this.userService.search(username);
    // console.log('Search results:', results);
    return results;
  }


}

import { Controller, Get, Post, Body, Param, UseGuards, Req, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Role, User } from './entities/user.entity';
import { AppAbility } from './ability.factor';
import { Action } from './action.enum';
import { UmrahPackage } from './entities/umrah.entity';
import { CheckPolicies } from './policy.decorator';
import { PoliciesGuard } from './policy.guard';
// import { Request,Response } from 'express';




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

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  findAllpackages(@Req() req: any) {
    return 'user get all the packages'
  }

  @Get(':userId')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  findOne(@Param('userId') userId: string, @Req() req: any) {
    return this.userService.findOne(+userId, req.user);
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, User))
  create() {
    return 'editor can create and update the packages'
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  async findAll(@Request() req) {
    // Admins can view all users, editors can view their own and other editors' profiles, general users can only view their profile.
    return 'Manage all editors profiles and user details'
  }

}

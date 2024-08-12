import { Controller, Get, Post, Body, Param, UseGuards, Req, Request, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AppAbility } from './ability.factor';
import { Action } from './action.enum';
import { UmrahPackage } from './entities/umrah.entity';
import { CheckPolicies } from './policy.decorator';
import { PoliciesGuard } from './policy.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';



@ApiTags('Users') // Tagging the controller for grouping in Swagger UI
@ApiBearerAuth() // Adding bearer token authentication
@Controller('user')
export class UserController {
  JwtService: any;
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService,) { }


  @Post('login')
  @ApiOperation({ summary: 'User login to get JWT token' })
  @ApiResponse({ status: 200, description: 'User logged in successfully and token returned.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'User\'s username' },
        password: { type: 'string', description: 'User\'s password' },
      },
      required: ['username', 'password'],
    },
  })
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.userService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.userId };
    const token = this.jwtService.sign(payload, { secret: 'your_jwt_secret' });
    console.log(payload)

    return {
      access_token: token,
    };
  }

  @Post('booking')
  @ApiOperation({ summary: 'Search for a booking by username' })
  @ApiResponse({ status: 200, description: 'Search results returned successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameter.' })
  async search(@Query('username') username: string) {
    console.log('Search endpoint hit with query:', username);
    const results = await this.userService.search(username);
    return results;
  }


  @UseGuards(JwtAuthGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UmrahPackage))
  @Get('packages')
  @ApiOperation({ summary: 'Get all Umrah packages' })
  @ApiResponse({ status: 200, description: 'Umrah packages retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllPackages() {
    return 'Get all Umrah packages';
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getUser(@Param('id') id: string) {
    return `Get user with ID ${id}`;
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, UmrahPackage))
  @Post('packages')
  @ApiOperation({ summary: 'Create a new Umrah package' })
  @ApiResponse({ status: 201, description: 'Umrah package created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createPackage(@Body() createPackageDto: any) {
    return 'Create a new Umrah package';
  }





}

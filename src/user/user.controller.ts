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
import { Role } from './roles.enum';



@ApiTags('Users') // Tagging the controller for grouping in Swagger UI
@ApiBearerAuth() // Adding bearer token authentication
@Controller('user')
export class UserController {
  JwtService: any;
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService,) { }



  //register user 
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'Search results returned successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameter.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john@example.com' },
        contactNumber: { type: 'string', example: '+1234567890' },
        password: { type: 'string', example: 'securePassword123' },
        role: {
          type: 'string',
          example: Role.USER,
          enum: [Role.USER, Role.ADMIN]
        },
      },
    },
  })

  @Post('register')
  async registerUser(
    @Body() body: {
      name: string;
      username: string;
      email: string;
      contactNumber: string;
      password: string;
      role?: Role
    },
  ): Promise<User> {
    return this.userService.registerUser(
      body.name,
      body.username,
      body.email,
      body.contactNumber,
      body.password,
      body.role || Role.USER,
    );
  }


  //login
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
  //
  @Post('booking')
  @ApiOperation({ summary: 'Search for a booking by username and also check the caching' })
  @ApiResponse({ status: 200, description: 'Search results returned successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameter.' })
  async search(@Query('username') username: string) {
    console.log('Search endpoint hit with query:', username);
    const results = await this.userService.search(username);
    return results;
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, UmrahPackage))
  @ApiOperation({ summary: 'Create a new Umrah package' })
  @ApiResponse({ status: 200, description: 'Umrah packages retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Basic Package' },
        packageName: { type: 'string', example: 'Economy' },
        totalDuration: { type: 'string', example: '7 days' },
        price: { type: 'number', example: 1500 },
      },
    },
  })
  @Post('packages')
  async createUmrahPackage(
    @Body() body: { name: string; packageName: string; totalDuration: string; price: number },
  ): Promise<UmrahPackage> {
    return this.userService.createUmrahPackage(
      body.name,
      body.packageName,
      body.totalDuration,
      body.price,
    );
  }


  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UmrahPackage))
  @Get('packages')
  @ApiOperation({ summary: 'Get all Umrah packages' })
  @ApiResponse({ status: 200, description: 'Umrah packages retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAllPackages() {
    return await this.userService.findAllPackages()
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Get('user/:username')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('username') username: string) {
    return await this.userService.findOneByusername(username)
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @Get('alluser')
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async finalluser() {
    return await this.userService.findAlluser()
  }





}

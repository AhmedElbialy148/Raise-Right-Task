import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import { FetchUsersDto } from './dto/fetch-users.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  findAll(@Query() fetchUsersDto: FetchUsersDto) {
    return this.usersService.findAll(fetchUsersDto);
  }

  @Get('current-user')
  async getCurrentUser(@CurrentUser() currentUser: AuthenticatedUser): Promise<User | undefined> {
    return this.usersService.findOneById(currentUser.sub);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  findOneById(@Param('id') id: string): Promise<User | undefined> {
    return this.usersService.findOneById(id);
  }

  @Patch('current')
  async updateCurrentUser(@Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: AuthenticatedUser ) {
    return this.usersService.updateUserById( currentUser.sub, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @Delete('/current-user')
  removeCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.removeById(user.sub);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  removeById(@Param('id') id: string) {
    return this.usersService.removeById(id);
  }
}

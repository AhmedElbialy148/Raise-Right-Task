import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateGoalDto } from './dto/create-goal.dto';
import { FetchGoalsDto } from './dto/fetch-goals.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  create(@Body() dto: CreateGoalDto, @CurrentUser() user: AuthenticatedUser) {
    return this.goalsService.create(dto, user.sub);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  findAllByUserId(@Query() query: FetchGoalsDto, @CurrentUser() user: AuthenticatedUser) {
    return this.goalsService.findAllByUserId(query, user.sub);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  updateById(@Param('id') id: string, @Body() dto: UpdateGoalDto, @CurrentUser() user: AuthenticatedUser) {
    return this.goalsService.updateById(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.goalsService.remove(id, user);
  }

  @Get('/public')
  findPublic(@Query() query: FetchGoalsDto) {
    return this.goalsService.findAllPublic(query);
  }

  @Get('/public/:publicId')
  findByPublicId(@Param('publicId') publicId: string) {
    return this.goalsService.findOneByPublicId(publicId);
  }
}

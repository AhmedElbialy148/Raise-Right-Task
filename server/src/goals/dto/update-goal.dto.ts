import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
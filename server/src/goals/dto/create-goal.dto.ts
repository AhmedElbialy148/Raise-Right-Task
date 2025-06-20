import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDateString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Deadline is required' })
  @IsDateString()
  deadline: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Public is required' })
  @IsBoolean()
  isPublic: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Public is required' })
  @IsNumber()
  order: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publicId?: string;
}
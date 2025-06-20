import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RoleEnum } from 'src/common/enums';

export class FetchUsersDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: RoleEnum })
  @IsIn(Object.values(RoleEnum))
  @IsOptional()
  role?: RoleEnum;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEmail()
  email: string;
}

export class UpdateUserCredentialsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password?: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
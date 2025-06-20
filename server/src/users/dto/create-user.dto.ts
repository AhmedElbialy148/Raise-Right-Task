import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { RoleEnum } from 'src/common/enums';

export class CreateUserDto {
  // @ApiProperty({ type: String })
  // @IsNotEmpty({ message: 'Username is required' })
  // @IsString()
  // username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6)
  password: string;
}
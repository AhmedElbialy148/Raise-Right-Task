import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/users/entities/user.entity';
import * as argon2 from 'argon2';
import { handleError } from 'src/common/helpers/error-handling';
import { hashData } from 'src/common/helpers/password.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<any> {
    try {
      console.log(createUserDto)
      const newUser = await this.usersService.create(createUserDto);
      if(!newUser) throw new BadRequestException('User not created');
      let res = await this.formatLoginAndSignUpResponse(newUser);
      
      // save user refreshToken
      await this.updateRefreshToken(newUser.id, res?.refreshToken || '');
      return res;    
    } catch (error) {
      handleError(error);
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(data.email);
      if (!user) throw new NotFoundException('User not found');
  
      const passwordMatches = await argon2.verify(user.password, data.password);
      if (!passwordMatches) throw new BadRequestException('Password is incorrect');
  
      let res = await this.formatLoginAndSignUpResponse(user);
      // save user refreshToken
      await this.updateRefreshToken(user.id, res?.refreshToken || '');
      
      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async formatLoginAndSignUpResponse(user: User) {
    try {
      // Generate new tokens
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user.id.toString(), user.role.toString()),
        this.generateRefreshToken(user.id.toString(), user.role.toString()),
      ])
      return {
        accessToken,
        refreshToken,
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async generateAccessToken(userId: any, role: string){
    return this.jwtService.signAsync(
      {
        sub: userId,
        role
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: `5h`,
      },
    )
  }
  async generateRefreshToken(userId: any, role: string){
    return this.jwtService.signAsync(
      {
        sub: userId,
        role,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    )
  }

  async updateRefreshToken(userId: any, refreshToken: string) {
    try {
      const hashedRefreshToken = await hashData(refreshToken);
      await this.usersService.updateUserCredentials(userId, {
        refreshToken: hashedRefreshToken,
      });
      
    } catch (error) {
      handleError(error);
    }
  }
}

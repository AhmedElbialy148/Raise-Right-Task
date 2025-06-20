import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserCredentialsDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { FetchUsersDto } from './dto/fetch-users.dto';
import { handleError } from 'src/common/helpers/error-handling';
import { hashData } from 'src/common/helpers/password.helper';
import { RoleEnum } from 'src/common/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: CreateUserDto) {
    try {
      // Check if user already exists
      let existingUser = await this.userRepo.findOneBy({ email: data.email });
      if(existingUser) throw new BadRequestException('User already exists');

      let hashedPassword = await hashData(data.password);
      const user = this.userRepo.create({
        ...data,
        role: RoleEnum.USER,
        password: hashedPassword,
      });
      await this.userRepo.save(user);
      return user
      
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(query: FetchUsersDto) {
    try {
      const { page = 1, perPage = 10, search } = query;

      const where: any = [];
    
      if (search) {
        const words = search.trim().split(/\s+/);
        for (const word of words) {
          where.push([
            { email: ILike(`%${word}%`) },
            { role: ILike(`%${word}%`) },
          ]);
        }
      }

      const [data, total] = await Promise.all([
        this.userRepo.find({
          where: where.length
            ? where.flat()
            : {},
          skip: (page - 1) * perPage,
          take: perPage,
          order: { createdAt: 'DESC' },
        }),
        this.userRepo.count(),
      ])
    
      return {
        data,
        total,
        page: +page,
        perPage: +perPage,
        totalPages: Math.ceil(total / perPage),
      };

    } catch (error) {
      handleError(error);
    }
  }

  async findOneById(id: string) {
    try {
      let user = await this.userRepo.findOneBy({ id });
      
      if(!user) throw new NotFoundException('User not found');

      return user;
      
    } catch (error) {
      handleError(error);
    }
  }

  async findByEmail(email: string) {
    try {
      return this.userRepo.findOne({ where: { email } });

    } catch (error) {
      handleError(error);
    }
  }

  async updateUserById(userId: string, newData: UpdateUserDto ) {
    try {
      const res = await this.userRepo.update(userId, newData);
      if(res.affected === 0) throw new NotFoundException('User not found');
      return { message: 'User updated successfully' };

    } catch (error) {
      handleError(error);
    }
  }

  async updateUserCredentials(userId: string, newData: UpdateUserCredentialsDto ) {
    try {
      // Hash password
      if (newData.password) newData.password = await hashData(newData.password);

      const res = await this.userRepo.update(userId, newData);
      if(res.affected === 0) throw new NotFoundException('User not found');
      return { message: 'User updated successfully' };
      
    } catch (error) {
      handleError(error);
    }
  }

  async removeById(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');
      
      await this.userRepo.delete(id);

      return {message: 'User deleted successfully'}
      
    } catch (error) {
      handleError(error);
    }
  }
}

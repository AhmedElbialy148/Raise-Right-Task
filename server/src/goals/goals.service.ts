import { Injectable, NotFoundException, Query, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { FetchGoalsDto } from './dto/fetch-goals.dto';
import { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import { handleError } from 'src/common/helpers/error-handling';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(@InjectRepository(Goal) private goalRepo: Repository<Goal>) {}

  create(dto: CreateGoalDto, userId: string) {
    try {
      const goal = this.goalRepo.create({ 
        ...dto, 
        owner: { id: userId },
        publicId: dto.isPublic ? Math.random().toString(36).substring(2, 20) : undefined,
      });
      return this.goalRepo.save(goal);
      
    } catch (error) {
      handleError(error);
    }
  }

  async findAllByUserId(query: FetchGoalsDto, userId: string) {
    try {
      // const { page = 1, perPage = 10 } = query;
  
      const [data, total] = await Promise.all([
        this.goalRepo.find({
          where: { owner: { id: userId } },
          // skip: (page - 1) * perPage,
          // take: perPage,
          order: { createdAt: 'DESC' },
        }),
        this.goalRepo.count(),
      ])
    
      return data;
      
    } catch (error) {
      handleError(error);
    }
  }

  async findAllPublic(query: FetchGoalsDto) {
    try {
      const { page = 1, perPage = 10 } = query;
  
      const [data, total] = await Promise.all([
        this.goalRepo.find({
          where: { isPublic: true },
          skip: (page - 1) * perPage,
          take: perPage,
          order: { createdAt: 'DESC' },
        }),
        this.goalRepo.count(),
      ])
      
      return data;
      // return {
      //   data,
      //   total,
      //   page: +page,
      //   perPage: +perPage,
      //   totalPages: Math.ceil(total / perPage),
      // };
      
    } catch (error) {
      handleError(error);
    }
  }

  async findOneByPublicId(publicId: string) {
    try {
      const goal = await this.goalRepo.findOne({
        where: { publicId },
        relations: ['owner', 'parent', 'children'],
      });
      if(!goal) throw new NotFoundException('Goal not found');
      return goal;
      
    } catch (error) {
      handleError(error);
    }
  }

  async updateById(id: string, data: UpdateGoalDto, currentUser: AuthenticatedUser) {
    try {
      // Check if goal exists
      const goal = await this.goalRepo.findOne({
        where: { id },
        relations: ['owner', 'parent', 'children'],
      });
      if(!goal) throw new NotFoundException('Goal not found');

      // Check if user is the owner of the goal
      if (currentUser.sub !== goal.owner.id) throw new UnauthorizedException('Unauthorized');

      // Update goal
      let res = await this.goalRepo.update(id, {
        ...data,
        publicId: data.isPublic ? Math.random().toString(36).substring(2, 20) : undefined,
      });
      if(res.affected === 0) throw new NotFoundException('Goal not found');
      return { message: 'Goal updated successfully' };
      
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string, currentUser: AuthenticatedUser) {
    try {
      // Check if goal exists
      const goal = await this.goalRepo.findOne({
        where: { id },
        relations: ['owner', 'parent', 'children'],
      });
      if(!goal) throw new NotFoundException('Goal not found');

      // Check if user is the owner of the goal
      if (currentUser.sub !== goal.owner.id) throw new UnauthorizedException('Unauthorized');
  
      await this.goalRepo.delete(id);
  
      return { message: 'Goal deleted successfully' };
      
    } catch (error) {
      console.log(error)
      handleError(error);
    }
  }
}

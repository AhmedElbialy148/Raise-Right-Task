import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Goal } from 'src/goals/entities/goal.entity';
import { RoleEnum } from 'src/common/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;
  
  // @Column() 
  // username: string;
  
  @Column({ unique: true }) 
  email: string;
  
  @Column() 
  password: string;
  
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: string;

  @OneToMany(() => Goal, (goal) => goal.owner)
  goals: Goal[];

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

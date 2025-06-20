import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn('uuid') 
  id: string;
  
  @Column() 
  title: string;
  
  @Column({ nullable: true }) 
  description: string;
  
  @Column() 
  deadline: Date;
  
  @Column({ default: false }) 
  isPublic: boolean;
  
  @Column({ nullable: true }) 
  parentId: string;
  
  @Column() 
  order: number;
  
  @Column({ nullable: true }) 
  publicId: string;
  
  @Column({ default: false }) 
  completed: boolean;

  @ManyToOne(() => User, (user) => user.goals)
  owner: User;

  @ManyToOne(() => Goal, (goal) => goal.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Goal;

  @OneToMany(() => Goal, (goal) => goal.parent)
  children: Goal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { Component, OnInit } from '@angular/core';
import { GoalService } from 'src/app/services/goal.service';
import { Goal } from 'src/app/models/goal.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  goals: Goal[] = [];
  goalsTree: Goal[] = [];
  loading = true;
  errorMessage = '';
  defaultDeadline = new Date();
  newGoal = {
    title: '',
    description: '',
    deadline: this.formatDate(new Date()),
    isPublic: false,
    parentId: null,
  };

  constructor(private goalService: GoalService) {}

  ngOnInit() {
    this.fetchGoals();
  }

  fetchGoals() {
    this.loading = true;
    this.goalService.fetchGoals().subscribe({
      next: (res) => {
        this.goals = res;
        this.goalsTree = this.buildTree(res);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch goals';
        this.loading = false;
      }
    });
  }

  buildTree(goals: Goal[]): Goal[] {
    const map = new Map<string, Goal>();
    const roots: Goal[] = [];

    goals.forEach(goal => map.set(goal.id, { ...goal, children: [] }));

    map.forEach(goal => {
      if (goal.parentId) {
        const parent = map.get(goal.parentId);
        if (parent) parent.children.push(goal);
      } else {
        roots.push(goal);
      }
    });

    return roots.sort((a, b) => a.order - b.order);
  }

  drop(event: CdkDragDrop<Goal[]>) {
    moveItemInArray(this.goals, event.previousIndex, event.currentIndex);
    this.updateGoalOrders();
  }

  updateGoalOrders() {
    this.goals.forEach((goal, index) => {
      if (goal.order !== index) {
        goal.order = index;
        this.goalService.updateGoal(goal.id, { order: index }).subscribe();
      }
    });
    this.goalsTree = this.buildTree(this.goals);
  }
  
  createGoal() {
    if(this.newGoal.title.trim().length === 0) return;

    const goalPayload = {
      ...this.newGoal,
      title: this.newGoal.title.trim(),
      description: this.newGoal.description.trim(),
      deadline: new Date(this.newGoal.deadline),
      isPublic: this.newGoal.isPublic,
      parentId: this.newGoal.parentId || undefined,
      order: this.goals.length,
      completed: false,
    };
  
    this.goalService.createGoal(goalPayload).subscribe({
      next: (res) => {
        if(res.id){
          this.goals.push({...goalPayload, id: res.id || '', children: [] });
          this.goalsTree = this.buildTree(this.goals);
          this.newGoal = {
            title: '',
            description: '',
            deadline: this.formatDate(new Date()),
            isPublic: false,
            parentId: null,
          };

        }
      },
      error: () => {
        this.errorMessage = 'Failed to create goal';
      }
    });
  }

  deleteGoal(id: string) {
    this.goalService.deleteGoal(id).subscribe({
      next: () => {
        this.goals = this.goals.filter(goal => goal.id !== id);
        this.goalsTree = this.buildTree(this.goals);
      },
      error: () => {
        this.errorMessage = 'Failed to delete goal';
      }
    });
  }

  toggleVisibility(goal: Goal) {
    this.goalService.updateGoal(goal.id, { isPublic: !goal.isPublic }).subscribe({
      next: () => goal.isPublic = !goal.isPublic
    });
  }

  updateDeadline(goal: Goal, event: Event) {
    const input = event.target as HTMLInputElement;
    const dateStr = input.value;
    const newDate = new Date(dateStr);
    this.goalService.updateGoal(goal.id, { deadline: newDate }).subscribe();
  }
  
  toggleCompleted(goal: any) {
    goal.completed = !goal.completed;
    this.goalService.updateGoal(goal.id, { completed: goal.completed }).subscribe({
      next: () => {
        let index = this.goals.findIndex((g: any) => g.id === goal.id);
        this.goals[index].completed = goal.completed;
        this.goalsTree = this.buildTree(this.goals);
      },
      error: (err) => {
        console.error('Failed to update completed status', err);
      },
    });
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

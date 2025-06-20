import { Component, OnInit } from '@angular/core';
import { Goal } from '../models/goal.model';
import { HttpClient } from '@angular/common/http';
import { GoalService } from '../services/goal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-goals',
  templateUrl: './public-goals.component.html',
  styleUrls: ['./public-goals.component.css']
})
export class PublicGoalsComponent implements OnInit {
  publicGoals: Goal[] = [];

  constructor(private goalService: GoalService, private router: Router) {}
  ngOnInit() {
    this.goalService.getPublicGoals().subscribe((goals) => {
      console.log(goals);
      this.publicGoals = this.buildGoalTree(goals);
    });
  }

  viewGoal(goal: Goal) {
    this.router.navigate(['/public', goal.publicId], {
      state: { goal } // pass goal as state
    });
  }

  buildGoalTree(goals: Goal[]): Goal[] {
    const goalMap = new Map<string, Goal>();
    const roots: Goal[] = [];
  
    goals.forEach(goal => {
      goal.children = [];
      goalMap.set(goal.id, goal);
    });
  
    goals.forEach(goal => {
      if (goal.parentId && goalMap.has(goal.parentId)) {
        goalMap.get(goal.parentId)!.children.push(goal);
      } else {
        roots.push(goal);
      }
    });
  
    return roots;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

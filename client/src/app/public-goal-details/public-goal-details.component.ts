import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal } from '../models/goal.model';
import { GoalService } from '../services/goal.service';

@Component({
  selector: 'app-public-goal-details',
  templateUrl: './public-goal-details.component.html',
  styleUrls: ['./public-goal-details.component.css']
})
export class PublicGoalDetailsComponent implements OnInit {
  goal: any;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.goal = nav?.extras?.state?.['goal'];

    if (this.goal) {
      this.loading = false;
    } else {
      const publicId = this.route.snapshot.paramMap.get('publicId');
      if (publicId) {
        this.goalService.getPublicGoalById(publicId).subscribe({
          next: (res: Goal) => {
            this.goal = res;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Goal not found.';
            this.loading = false;
          }
        });
      }
    }
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }
}

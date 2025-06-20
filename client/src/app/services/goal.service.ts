import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Goal } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private baseUrl = 'http://localhost:3000/goals';

  constructor(private http: HttpClient) {}

  fetchGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.baseUrl);
  }

  createGoal(payload: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(this.baseUrl, payload);
  }

  updateGoal(id: string, payload: Partial<Goal>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  deleteGoal(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getPublicGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.baseUrl}/public`);
  }

  getPublicGoalById(id:string): Observable<Goal> {
    return this.http.get<Goal>(`${this.baseUrl}/public/${id}`);
  }
}
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/store/auth/auth.actions';
import { Observable } from 'rxjs';
import { User } from 'src/app/store/auth/auth.state';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user$: Observable<User | null>;

  constructor(private store: Store<{ auth: { user: User | null } }>) {
    this.user$ = this.store.select(state => state.auth.user);
  }

  logout() {
    this.store.dispatch(logout());
  }
}

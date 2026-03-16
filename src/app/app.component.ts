import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="authService.isLoggedIn()" />
    <div [class]="authService.isLoggedIn() ? 'pt-16' : ''">
      <router-outlet />
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
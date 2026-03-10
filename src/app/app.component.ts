import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-green-50">
      <app-navbar />
      <main class="max-w-7xl mx-auto px-4 py-8">
         <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
 // 
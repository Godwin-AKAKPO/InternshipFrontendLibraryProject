import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="h-screen bg-green-50 grid grid-cols-10">
      <div class=" col-span-3 items-center justify-center overflow-hidden">
        <img src="/images/second.jpg" alt="Description" class="w-full h-full object-cover" />
      </div>
      <div class="flex flex-col overflow-hidden col-span-7">
        <app-navbar />
        <main class="flex-1 px-4 py-8 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppComponent {}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white  border-green-200 shadow-xl">
      <div class="max-w-7xl mx-auto px-3">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center gap-2">
            <span class="font-bold text-3xl text-green-500">Bibliothèque</span>
          </div>
          <div class="flex items-center gap-1">
            <a routerLink="/books" routerLinkActive=" text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Livres
            </a>
            <a routerLink="/categories" routerLinkActive=" text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Catégories
            </a>
            <a routerLink="/users" routerLinkActive=" text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Utilisateurs
            </a>
            <a routerLink="/loans" routerLinkActive=" text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Emprunts
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}




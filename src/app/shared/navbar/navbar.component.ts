import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-green-200 shadow-sm">
      <div class="max-w-6xl mx-auto px-2">
        <div class="flex items-center justify-between h-16">
          
          <div class="flex items-center gap-2">
            <span class="text-2xl"></span>
            <span class="font-bold text-xl text-green-500">Bibliothèque</span>
          </div>

          <div class="flex items-center gap-1">
            <a routerLink="/books" routerLinkActive="bg-green-100 text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Livres
            </a>
            <a routerLink="/categories" routerLinkActive="bg-green-100 text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Catégories
            </a>
            <a routerLink="/users" routerLinkActive="bg-green-100 text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Utilisateurs
            </a>
            <a routerLink="/loans" routerLinkActive="bg-green-100 text-green-600 font-semibold"
               class="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <span></span> Emprunts
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
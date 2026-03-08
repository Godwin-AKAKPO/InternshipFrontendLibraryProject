import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800"> Utilisateurs</h1>
          <p class="text-sm text-gray-500 mt-1">{{ users.length }} utilisateur(s)</p>
        </div>
        <button (click)="toggleForm()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Ajouter</button>
      </div>
      <div *ngIf="showForm" class="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Nouvel utilisateur</h2>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Nom</label>
            <input [(ngModel)]="newUser.name" type="text" placeholder="Nom" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input [(ngModel)]="newUser.email" type="email" placeholder="email@exemple.com" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="createUser()" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Enregistrer</button>
          <button (click)="toggleForm()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Annuler</button>
        </div>
      </div>
      <div *ngIf="errorMsg" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{{ errorMsg }}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let user of users" class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">{{ user.name.charAt(0).toUpperCase() }}</div>
            <div><p class="font-semibold text-gray-800">{{ user.name }}</p><p class="text-xs text-gray-400">ID: {{ user.id }}</p></div>
          </div>
          <p class="text-sm text-gray-600">✉️ {{ user.email }}</p>
        </div>
        <div *ngIf="users.length === 0" class="col-span-3 text-center py-10 text-gray-400">Chargement...</div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  showForm = false;
  errorMsg = '';
  newUser: Omit<User, 'id'> = { name: '', email: '' };

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: data => { this.users = data; this.cdr.detectChanges(); },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.cdr.detectChanges(); }
    });
  }

  toggleForm() { this.showForm = !this.showForm; this.newUser = { name: '', email: '' }; }

  createUser() {
    if (!this.newUser.name || !this.newUser.email) return;
    this.userService.create(this.newUser).subscribe({ next: () => { this.loadUsers(); this.toggleForm(); } });
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../core/services/user.service';
import { LoanService, Loan } from '../../../core/services/loan.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800"> Utilisateurs</h1>
          <p class="text-sm text-gray-500 mt-1">{{ users.length }} utilisateur(s)</p>
        </div>
        <button (click)="toggleForm()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Ajouter un utilisateur</button>
      </div>

      <!-- Formulaire ajout -->
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

      <!-- Tableau utilisateurs -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-left">
              <th class="px-4 py-3 font-semibold text-gray-600">ID</th>
              <th class="px-4 py-3 font-semibold text-gray-600">Nom</th>
              <th class="px-4 py-3 font-semibold text-gray-600">Email</th>
              <th class="px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users" class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                [class.bg-green-50]="selectedUser?.id === user.id">
              <td class="px-4 py-3 text-gray-400">{{ user.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ user.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
              <td class="px-4 py-3">
                <button (click)="voirEmprunts(user)"
                  class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  {{ selectedUser?.id === user.id ? 'Masquer' : 'Voir emprunts' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="4" class="px-4 py-10 text-center text-gray-400">Chargement...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Panel emprunts — affiché SOUS le tableau -->
      <div *ngIf="selectedUser" class="mt-4 bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 bg-green-50 border-b border-green-100">
          <div>
            <h3 class="text-sm font-bold text-gray-800">
              Emprunts de <span class="text-green-700">{{ selectedUser.name }}</span>
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ selectedUserLoans.length }} emprunt(s) au total</p>
          </div>
          <button (click)="fermerModal()"
            class="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
            ✕ Fermer
          </button>
        </div>

        <div class="px-6 py-4">
          <div *ngIf="loadingLoans" class="text-center py-6 text-gray-400 text-sm">Chargement...</div>

          <table *ngIf="!loadingLoans" class="w-full text-sm">
            <thead>
              <tr class="text-left border-b border-gray-200">
                <th class="pb-2 px-2 font-semibold text-gray-600">Livre</th>
                <th class="pb-2 px-2 font-semibold text-gray-600">Date emprunt</th>
                <th class="pb-2 px-2 font-semibold text-gray-600">Date retour</th>
                <th class="pb-2 px-2 font-semibold text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loan of selectedUserLoans" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3 px-2 font-medium text-gray-800">{{ loan.book?.title }}</td>
                <td class="py-3 px-2 text-gray-600">{{ loan.loanDate }}</td>
                <td class="py-3 px-2 text-gray-600">{{ loan.returnDate || '—' }}</td>
                <td class="py-3 px-2">
                  <span [class]="!loan.returnDate
                    ? 'bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium'
                    : 'bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium'">
                    {{ loan.returnDate ? 'Retourné' : 'En cours' }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="selectedUserLoans.length === 0">
                <td colspan="4" class="py-8 text-center text-gray-400">Aucun emprunt pour cet utilisateur</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  showForm = false;
  errorMsg = '';
  newUser: Omit<User, 'id'> = { name: '', email: '' };

  selectedUser: User | null = null;
  selectedUserLoans: Loan[] = [];
  loadingLoans = false;

  constructor(
    private userService: UserService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef
  ) {}

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

  voirEmprunts(user: User) {
    if (this.selectedUser?.id === user.id) {
      this.selectedUser = null;
      this.selectedUserLoans = [];
      return;
    }
    this.selectedUser = user;
    this.loadingLoans = true;
    this.selectedUserLoans = [];
    this.loanService.getUserLoans(user.id).subscribe({
      next: data => { this.selectedUserLoans = data; this.loadingLoans = false; this.cdr.detectChanges(); },
      error: () => { this.loadingLoans = false; this.cdr.detectChanges(); }
    });
  }

  fermerModal() { this.selectedUser = null; this.selectedUserLoans = []; }
}

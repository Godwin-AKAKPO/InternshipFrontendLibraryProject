import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, Loan } from '../../../core/services/loan.service';
import { BookService, Book } from '../../../core/services/book.service';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Emprunts</h1>
          <p class="text-sm text-gray-500 mt-1">{{ loans.length }} emprunt(s)</p>
        </div>
        <button (click)="toggleBorrowForm()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xl font-medium">Nouvel emprunt</button>
      </div>
      <div *ngIf="showBorrowForm" class="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Enregistrer un emprunt</h2>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Livre disponible</label>
            <select [(ngModel)]="borrowBookId" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option [value]="0">-- Choisir --</option>
              <option *ngFor="let b of availableBooks" [value]="b.id">{{ b.title }}</option>
            </select></div>
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Utilisateur</label>
            <select [(ngModel)]="borrowUserId" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option [value]="0">-- Choisir --</option>
              <option *ngFor="let u of users" [value]="u.id">{{ u.name }}</option>
            </select></div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="borrowBook()" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Confirmer</button>
          <button (click)="toggleBorrowForm()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Annuler</button>
        </div>
      </div>
      <div *ngIf="successMsg" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{{ successMsg }}</div>
      <div *ngIf="errorMsg" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{{ errorMsg }}</div>
      <div class="flex gap-2 mb-4">
        <button (click)="filter='all'" [class]="filter==='all' ? 'bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm' : 'bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-sm'">Tous ({{ loans.length }})</button>
        <button (click)="filter='active'" [class]="filter==='active' ? 'bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm' : 'bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-sm'">En cours ({{ activeLoans.length }})</button>
        <button (click)="filter='returned'" [class]="filter==='returned' ? 'bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm' : 'bg-white text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-sm'">Retournés ({{ returnedLoans.length }})</button>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full text-xl">
          <thead><tr class="bg-gray-50 border-b border-gray-200 text-left">
            <th class="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Livre</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Utilisateur</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Date emprunt</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Date retour</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Statut</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            <tr *ngFor="let loan of filteredLoans" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-400">{{ loan.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ loan.book?.title }}</td>
              <td class="px-4 py-3 text-gray-600">{{ loan.user?.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ loan.loanDate }}</td>
              <td class="px-4 py-3 text-gray-600">{{ loan.returnDate || ' ' }}</td>
              <td class="px-4 py-3"><span [class]="!loan.returnDate ? 'bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-xs' : 'bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs'">{{ loan.returnDate ? 'Retourné' : 'En cours' }}</span></td>
              <td class="px-4 py-3"><button *ngIf="!loan.returnDate" (click)="returnBook(loan.book.id)" class="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Retourner</button></td>
            </tr>
            <tr *ngIf="filteredLoans.length === 0"><td colspan="7" class="px-4 py-10 text-center text-gray-400">Chargement...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  availableBooks: Book[] = [];
  users: User[] = [];
  showBorrowForm = false;
  errorMsg = '';
  successMsg = '';
  filter: 'all' | 'active' | 'returned' = 'all';
  borrowBookId = 0;
  borrowUserId = 0;

  get activeLoans() { return this.loans.filter(l => !l.returnDate); }
  get returnedLoans() { return this.loans.filter(l => !!l.returnDate); }
  get filteredLoans() { return this.filter === 'active' ? this.activeLoans : this.filter === 'returned' ? this.returnedLoans : this.loans; }

  constructor(private loanService: LoanService, private bookService: BookService, private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadLoans();
    this.bookService.getAll().subscribe(b => { this.availableBooks = b.filter(book => book.available); this.cdr.detectChanges(); });
    this.userService.getAll().subscribe(u => { this.users = u; this.cdr.detectChanges(); });
  }

  loadLoans() {
    this.loanService.getAll().subscribe({
      next: data => { this.loans = data; this.cdr.detectChanges(); },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.cdr.detectChanges(); }
    });
  }

  toggleBorrowForm() { this.showBorrowForm = !this.showBorrowForm; this.borrowBookId = 0; this.borrowUserId = 0; }

  borrowBook() {
    if (!this.borrowBookId || !this.borrowUserId) return;
    this.loanService.borrow(this.borrowBookId, this.borrowUserId).subscribe({
      next: () => { this.successMsg = 'Emprunt enregistré !'; this.loadLoans(); this.bookService.getAll().subscribe(b => { this.availableBooks = b.filter(book => book.available); this.cdr.detectChanges(); }); this.toggleBorrowForm(); setTimeout(() => this.successMsg = '', 3000); },
      error: () => this.errorMsg = 'Erreur emprunt'
    });
  }

  returnBook(bookId: number) {
    this.loanService.return(bookId).subscribe({
      next: () => { this.successMsg = 'Livre retourné !'; this.loadLoans(); setTimeout(() => this.successMsg = '', 3000); },
      error: () => this.errorMsg = 'Erreur retour'
    });
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book, BookDTO } from '../../../core/services/book.service';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800"> Livres</h1>
          <p class="text-sm text-gray-500 mt-1">{{ books.length }} livre(s)</p>
        </div>
        <button (click)="toggleForm()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Ajouter</button>
      </div>

      <div *ngIf="showForm" class="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Nouveau livre</h2>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Titre</label>
            <input [(ngModel)]="newBook.title" type="text" placeholder="Titre" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Auteur</label>
            <input [(ngModel)]="newBook.author" type="text" placeholder="Auteur" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div><label class="block text-sm font-medium text-gray-600 mb-1">Catégorie</label>
            <select [(ngModel)]="newBook.categoryId" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option [value]="0">-- Choisir --</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select></div>
        </div>
        <div class="flex gap-3 mt-4">
          <button (click)="createBook()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Enregistrer</button>
          <button (click)="toggleForm()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Annuler</button>
        </div>
      </div>

      <div *ngIf="errorMsg" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{{ errorMsg }}</div>

      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead><tr class="bg-gray-50 border-b border-gray-200 text-left">
            <th class="px-4 py-3 font-semibold text-gray-600">ID</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Titre</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Auteur</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Catégorie</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Statut</th>
            <th class="px-4 py-3 font-semibold text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            <tr *ngIf="books.length === 0 && !errorMsg">
              <td colspan="6" class="px-4 py-10 text-center text-gray-400">Chargement...</td>
            </tr>
            <tr *ngFor="let book of books" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-400">{{ book.id }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ book.title }}</td>
              <td class="px-4 py-3 text-gray-600">{{ book.author }}</td>
              <td class="px-4 py-3"><span class="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-xs">{{ book.category?.name || '—' }}</span></td>
              <td class="px-4 py-3"><span [class]="book.available ? 'bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs' : 'bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs'">{{ book.available ? 'Disponible' : 'Emprunté' }}</span></td>
              <td class="px-4 py-3"><button (click)="deleteBook(book.id)" class="text-red-500 hover:text-red-700 text-xs">Supprimer</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  showForm = false;
  errorMsg = '';
  newBook: BookDTO = { title: '', author: '', categoryId: 0, isAvailable: true };

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  loadBooks() {
    this.bookService.getAll().subscribe({
      next: data => {
        this.books = data;
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMsg = 'Erreur de chargement';
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() { this.showForm = !this.showForm; this.newBook = { title: '', author: '', categoryId: 0, isAvailable: true }; }

  createBook() {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.categoryId) return;
    this.bookService.create(this.newBook).subscribe({ next: () => { this.loadBooks(); this.toggleForm(); }, error: () => this.errorMsg = 'Erreur création' });
  }

  deleteBook(id: number) {
    if (!confirm('Supprimer ?')) return;
    this.bookService.delete(id).subscribe(() => this.loadBooks());
  }
}
